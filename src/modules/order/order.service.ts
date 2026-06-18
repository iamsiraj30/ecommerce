import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

// ========== HELPERS ==========

// Generate unique order number
const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

// Common order include for consistent response shape
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

// ========== USER OPERATIONS ==========

// Checkout: Create order from cart (transactional)
const checkoutFromCart = async (
  userId: string,
  payload: {
    shippingAddressId: string;
    paymentMethod?: string;
  },
) => {
  const { shippingAddressId, paymentMethod } = payload;

  if (!shippingAddressId) {
    throw new AppError(400, "Shipping address ID is required");
  }

  // Run everything inside a transaction for atomicity
  const order = await prisma.$transaction(async (tx) => {
    // 1. Validate shipping address exists & belongs to user
    const shippingAddress = await tx.shippingAddress.findUnique({
      where: { id: shippingAddressId },
    });

    if (!shippingAddress) {
      throw new AppError(404, "Shipping address not found");
    }

    if (shippingAddress.userId !== userId) {
      throw new AppError(403, "This shipping address does not belong to you");
    }

    // 2. Fetch user's cart with items + product data
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

    // 3. Validate cart is not empty
    if (!cart || cart.items.length === 0) {
      throw new AppError(400, "Your cart is empty");
    }

    // 4. Validate stock for each item
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new AppError(
          400,
          `Insufficient stock for "${item.product.name}". Available: ${item.product.stock}, Requested: ${item.quantity}`,
        );
      }
    }

    // 5. Calculate subtotal & totalAmount
    const subtotal = cart.items.reduce((acc, item) => {
      return acc + item.quantity * item.product.price;
    }, 0);

    const discountAmount = 0;
    const totalAmount = subtotal - discountAmount;

    // 6. Generate unique order number
    const orderNumber = generateOrderNumber();

    // 7. Create Order record
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

    // 8. Create OrderItem records (snapshot unitPrice & totalPrice)
    await tx.orderItem.createMany({
      data: cart.items.map((item) => ({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.product.price,
        totalPrice: item.quantity * item.product.price,
      })),
    });

    // 9. Decrement product stock for each item
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

    // 10. Create Payment record
    await tx.payment.create({
      data: {
        orderId: newOrder.id,
        amount: totalAmount,
        provider: paymentMethod || "COD",
        status: "PENDING",
      },
    });

    // 11. Clear the user's cart items
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // 12. Return the complete order with all relations
    const completeOrder = await tx.order.findUnique({
      where: { id: newOrder.id },
      include: orderInclude,
    });

    return completeOrder;
  });

  return order;
};

// Get all orders for a user (paginated)
const getMyOrdersFromDB = async (userId: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: orderInclude,
    }),
    prisma.order.count({ where: { userId } }),
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

// Get single order by ID (with ownership check)
const getOrderByIdFromDB = async (orderId: string, userId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: orderInclude,
  });

  if (!order) {
    throw new AppError(404, "Order not found");
  }

  if (order.userId !== userId) {
    throw new AppError(403, "You don't have access to this order");
  }

  return order;
};

// Cancel order (only PENDING orders, restore stock)
const cancelOrderIntoDB = async (orderId: string, userId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
    },
  });

  if (!order) {
    throw new AppError(404, "Order not found");
  }

  if (order.userId !== userId) {
    throw new AppError(403, "You don't have access to this order");
  }

  if (order.orderStatus !== "PENDING") {
    throw new AppError(
      400,
      `Cannot cancel order with status "${order.orderStatus}". Only PENDING orders can be cancelled.`,
    );
  }

  // Run cancellation in a transaction
  const cancelledOrder = await prisma.$transaction(async (tx) => {
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

    // Update order status to CANCELLED
    const updated = await tx.order.update({
      where: { id: orderId },
      data: {
        orderStatus: "CANCELLED",
        paymentStatus: "REFUNDED",
      },
      include: orderInclude,
    });

    // Update payment status to REFUNDED
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

// ========== ADMIN OPERATIONS ==========

// Get all orders (admin, paginated with filters)
const getAllOrdersFromDB = async (
  page = 1,
  limit = 10,
  filters: {
    orderStatus?: string;
    paymentStatus?: string;
  } = {},
) => {
  const skip = (page - 1) * limit;

  const where: any = {};

  if (filters.orderStatus) {
    where.orderStatus = filters.orderStatus;
  }
  if (filters.paymentStatus) {
    where.paymentStatus = filters.paymentStatus;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
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
    prisma.order.count({ where }),
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

// Update order status (admin) with state transition validation
const updateOrderStatusIntoDB = async (orderId: string, status: string) => {
  const validStatuses = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  if (!validStatuses.includes(status)) {
    throw new AppError(
      400,
      `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    throw new AppError(404, "Order not found");
  }

  if (order.orderStatus === "CANCELLED") {
    throw new AppError(400, "Cannot update a cancelled order");
  }

  if (order.orderStatus === "DELIVERED") {
    throw new AppError(400, "Cannot update a delivered order");
  }

  // If admin is cancelling, restore stock
  if (status === "CANCELLED") {
    const cancelledOrder = await prisma.$transaction(async (tx) => {
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

  // Normal status update
  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      orderStatus: status as any,
    },
    include: orderInclude,
  });

  return updated;
};

// Update payment status (admin)
const updatePaymentStatusIntoDB = async (orderId: string, status: string) => {
  const validStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED"];

  if (!validStatuses.includes(status)) {
    throw new AppError(
      400,
      `Invalid payment status. Must be one of: ${validStatuses.join(", ")}`,
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payments: true },
  });

  if (!order) {
    throw new AppError(404, "Order not found");
  }

  // Update order's payment status
  await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: status as any,
    },
  });

  // Update all payment records for this order
  await prisma.payment.updateMany({
    where: { orderId },
    data: {
      status: status as any,
      ...(status === "PAID" ? { paidAt: new Date() } : {}),
    },
  });

  // Return updated order with relations
  const completeOrder = await prisma.order.findUnique({
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

export default orderService;
