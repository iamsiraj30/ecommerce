"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = require("../../lib/prisma");
const getPaymentsByOrderId = async (orderId, userId) => {
    const order = await prisma_1.prisma.order.findUnique({
        where: { id: orderId },
    });
    if (!order) {
        throw new AppError_1.default(404, "Order not found");
    }
    if (order.userId !== userId) {
        throw new AppError_1.default(403, "You don't have access to this order's payments");
    }
    const payments = await prisma_1.prisma.payment.findMany({
        where: { orderId },
        orderBy: { createdAt: "desc" },
        include: {
            order: {
                select: {
                    id: true,
                    orderNumber: true,
                    totalAmount: true,
                    orderStatus: true,
                },
            },
        },
    });
    return payments;
};
const getMyPaymentsFromDB = async (userId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const userOrders = await prisma_1.prisma.order.findMany({
        where: { userId },
        select: { id: true },
    });
    const orderIds = userOrders.map((o) => o.id);
    if (orderIds.length === 0) {
        return {
            meta: { page, limit, total: 0, totalPage: 0 },
            data: [],
        };
    }
    const [payments, total] = await Promise.all([
        prisma_1.prisma.payment.findMany({
            where: { orderId: { in: orderIds } },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                order: {
                    select: {
                        id: true,
                        orderNumber: true,
                        totalAmount: true,
                        orderStatus: true,
                        paymentStatus: true,
                    },
                },
            },
        }),
        prisma_1.prisma.payment.count({
            where: { orderId: { in: orderIds } },
        }),
    ]);
    const totalPage = Math.ceil(total / limit);
    return {
        meta: {
            page,
            limit,
            total,
            totalPage,
        },
        data: payments,
    };
};
const confirmCodPayment = async (orderId, userId) => {
    const order = await prisma_1.prisma.order.findUnique({
        where: { id: orderId },
        include: { payments: true },
    });
    if (!order) {
        throw new AppError_1.default(404, "Order not found");
    }
    if (order.userId !== userId) {
        throw new AppError_1.default(403, "You don't have access to this order");
    }
    if (order.orderStatus !== "DELIVERED") {
        throw new AppError_1.default(400, "COD payment can only be confirmed after delivery");
    }
    if (order.paymentStatus === "PAID") {
        throw new AppError_1.default(400, "This order has already been paid");
    }
    const codPayment = order.payments.find((p) => p.provider === "COD");
    if (!codPayment) {
        throw new AppError_1.default(400, "No COD payment found for this order");
    }
    const result = await prisma_1.prisma.$transaction(async (tx) => {
        const updatedPayment = await tx.payment.update({
            where: { id: codPayment.id },
            data: {
                status: "PAID",
                paidAt: new Date(),
            },
        });
        await tx.order.update({
            where: { id: orderId },
            data: {
                paymentStatus: "PAID",
            },
        });
        return updatedPayment;
    });
    return result;
};
const getAllPaymentsFromDB = async (page = 1, limit = 10, filters = {}) => {
    const skip = (page - 1) * limit;
    const where = {};
    if (filters.status) {
        where.status = filters.status;
    }
    if (filters.provider) {
        where.provider = filters.provider;
    }
    const [payments, total] = await Promise.all([
        prisma_1.prisma.payment.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                order: {
                    select: {
                        id: true,
                        orderNumber: true,
                        totalAmount: true,
                        orderStatus: true,
                        paymentStatus: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        }),
        prisma_1.prisma.payment.count({ where }),
    ]);
    const totalPage = Math.ceil(total / limit);
    return {
        meta: {
            page,
            limit,
            total,
            totalPage,
        },
        data: payments,
    };
};
const getPaymentByIdFromDB = async (paymentId) => {
    const payment = await prisma_1.prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
            order: {
                select: {
                    id: true,
                    orderNumber: true,
                    totalAmount: true,
                    orderStatus: true,
                    paymentStatus: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                        },
                    },
                    shippingAddress: true,
                },
            },
        },
    });
    if (!payment) {
        throw new AppError_1.default(404, "Payment not found");
    }
    return payment;
};
const paymentService = {
    getPaymentsByOrderId,
    getMyPaymentsFromDB,
    confirmCodPayment,
    getAllPaymentsFromDB,
    getPaymentByIdFromDB,
};
exports.default = paymentService;
