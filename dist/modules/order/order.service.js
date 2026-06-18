"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = require("../../lib/prisma");
const generateOrderNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
};
const orderInclude = {
    items: {
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    thumbnail: true,
                    price: true,
                },
            },
        },
    },
    shippingAddress: true,
    payments: {
        select: {
            id: true,
            amount: true,
            provider: true,
            method: true,
            status: true,
            transactionId: true,
            paidAt: true,
            createdAt: true,
        },
    },
};
// Checkout: Create order from cart
const checkoutFromCart = async (userId, payload) => {
    const { shippingAddressId, paymentMethod } = payload;
    if (!shippingAddressId) {
        throw new AppError_1.default(400, "Shipping address ID is required");
    }
    const order = await prisma_1.prisma.$transaction(async (tx) => {
        const shippingAddress = await tx.shippingAddress.findUnique({
            where: { id: shippingAddressId },
        });
        if (!shippingAddress) {
            throw new AppError_1.default(404, "Shipping address not found");
        }
        if (shippingAddress.userId !== userId) {
            throw new AppError_1.default(403, "This shipping address does not belong to you");
        }
        const cart = await tx.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!cart || cart.items.length === 0) {
            throw new AppError_1.default(400, "Your cart is empty");
        }
        for (const item of cart.items) {
            if (item.product.stock < item.quantity) {
                throw new AppError_1.default(400, `Insufficient stock for "${item.product.name}". Available: ${item.product.stock}, Requested: ${item.quantity}`);
            }
        }
        const subtotal = cart.items.reduce((acc, item) => {
            return acc + item.quantity * item.product.price;
        }, 0);
        const discountAmount = 0;
        const totalAmount = subtotal - discountAmount;
        const orderNumber = generateOrderNumber();
        const newOrder = await tx.order.create({
            data: {
                orderNumber,
                userId,
                shippingAddressId,
                subtotal,
                discountAmount,
                totalAmount,
                orderStatus: "PENDING",
                paymentStatus: "PENDING",
            },
        });
        await tx.orderItem.createMany({
            data: cart.items.map((item) => ({
                orderId: newOrder.id,
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.product.price,
                totalPrice: item.quantity * item.product.price,
            })),
        });
        for (const item of cart.items) {
            await tx.product.update({
                where: { id: item.productId },
                data: {
                    stock: {
                        decrement: item.quantity,
                    },
                },
            });
        }
        await tx.payment.create({
            data: {
                orderId: newOrder.id,
                amount: totalAmount,
                provider: paymentMethod || "COD",
                status: "PENDING",
            },
        });
        await tx.cartItem.deleteMany({
            where: { cartId: cart.id },
        });
        const completeOrder = await tx.order.findUnique({
            where: { id: newOrder.id },
            include: orderInclude,
        });
        return completeOrder;
    });
    return order;
};
const getMyOrdersFromDB = async (userId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
        prisma_1.prisma.order.findMany({
            where: { userId },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: orderInclude,
        }),
        prisma_1.prisma.order.count({ where: { userId } }),
    ]);
    const totalPage = Math.ceil(total / limit);
    return {
        meta: {
            page,
            limit,
            total,
            totalPage,
        },
        data: orders,
    };
};
const getOrderByIdFromDB = async (orderId, userId) => {
    const order = await prisma_1.prisma.order.findUnique({
        where: { id: orderId },
        include: orderInclude,
    });
    if (!order) {
        throw new AppError_1.default(404, "Order not found");
    }
    if (order.userId !== userId) {
        throw new AppError_1.default(403, "You don't have access to this order");
    }
    return order;
};
const cancelOrderIntoDB = async (orderId, userId) => {
    const order = await prisma_1.prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: true,
        },
    });
    if (!order) {
        throw new AppError_1.default(404, "Order not found");
    }
    if (order.userId !== userId) {
        throw new AppError_1.default(403, "You don't have access to this order");
    }
    if (order.orderStatus !== "PENDING") {
        throw new AppError_1.default(400, `Cannot cancel order with status "${order.orderStatus}". Only PENDING orders can be cancelled.`);
    }
    // Run cancellation in a transaction
    const cancelledOrder = await prisma_1.prisma.$transaction(async (tx) => {
        // Restore stock for each item
        for (const item of order.items) {
            await tx.product.update({
                where: { id: item.productId },
                data: {
                    stock: {
                        increment: item.quantity,
                    },
                },
            });
        }
        const updated = await tx.order.update({
            where: { id: orderId },
            data: {
                orderStatus: "CANCELLED",
                paymentStatus: "REFUNDED",
            },
            include: orderInclude,
        });
        await tx.payment.updateMany({
            where: { orderId },
            data: {
                status: "REFUNDED",
            },
        });
        return updated;
    });
    return cancelledOrder;
};
const getAllOrdersFromDB = async (page = 1, limit = 10, filters = {}) => {
    const skip = (page - 1) * limit;
    const where = {};
    if (filters.orderStatus) {
        where.orderStatus = filters.orderStatus;
    }
    if (filters.paymentStatus) {
        where.paymentStatus = filters.paymentStatus;
    }
    const [orders, total] = await Promise.all([
        prisma_1.prisma.order.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                ...orderInclude,
            },
        }),
        prisma_1.prisma.order.count({ where }),
    ]);
    const totalPage = Math.ceil(total / limit);
    return {
        meta: {
            page,
            limit,
            total,
            totalPage,
        },
        data: orders,
    };
};
const updateOrderStatusIntoDB = async (orderId, status) => {
    const validStatuses = [
        "PENDING",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
    ];
    if (!validStatuses.includes(status)) {
        throw new AppError_1.default(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }
    const order = await prisma_1.prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
    });
    if (!order) {
        throw new AppError_1.default(404, "Order not found");
    }
    if (order.orderStatus === "CANCELLED") {
        throw new AppError_1.default(400, "Cannot update a cancelled order");
    }
    if (order.orderStatus === "DELIVERED") {
        throw new AppError_1.default(400, "Cannot update a delivered order");
    }
    if (status === "CANCELLED") {
        const cancelledOrder = await prisma_1.prisma.$transaction(async (tx) => {
            // Restore stock
            for (const item of order.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            increment: item.quantity,
                        },
                    },
                });
            }
            const updated = await tx.order.update({
                where: { id: orderId },
                data: {
                    orderStatus: "CANCELLED",
                    paymentStatus: "REFUNDED",
                },
                include: orderInclude,
            });
            await tx.payment.updateMany({
                where: { orderId },
                data: { status: "REFUNDED" },
            });
            return updated;
        });
        return cancelledOrder;
    }
    const updated = await prisma_1.prisma.order.update({
        where: { id: orderId },
        data: {
            orderStatus: status,
        },
        include: orderInclude,
    });
    return updated;
};
const updatePaymentStatusIntoDB = async (orderId, status) => {
    const validStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED"];
    if (!validStatuses.includes(status)) {
        throw new AppError_1.default(400, `Invalid payment status. Must be one of: ${validStatuses.join(", ")}`);
    }
    const order = await prisma_1.prisma.order.findUnique({
        where: { id: orderId },
        include: { payments: true },
    });
    if (!order) {
        throw new AppError_1.default(404, "Order not found");
    }
    // Update order's payment status
    await prisma_1.prisma.order.update({
        where: { id: orderId },
        data: {
            paymentStatus: status,
        },
    });
    await prisma_1.prisma.payment.updateMany({
        where: { orderId },
        data: {
            status: status,
            ...(status === "PAID" ? { paidAt: new Date() } : {}),
        },
    });
    const completeOrder = await prisma_1.prisma.order.findUnique({
        where: { id: orderId },
        include: orderInclude,
    });
    return completeOrder;
};
const orderService = {
    checkoutFromCart,
    getMyOrdersFromDB,
    getOrderByIdFromDB,
    cancelOrderIntoDB,
    getAllOrdersFromDB,
    updateOrderStatusIntoDB,
    updatePaymentStatusIntoDB,
};
exports.default = orderService;
