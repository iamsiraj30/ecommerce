import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import orderService from "./order.service";

// ========== USER ENDPOINTS ==========

// POST /order/checkout — Create order from cart
const checkout = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.user?.userId;

  const result = await orderService.checkoutFromCart(
    userId as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Order placed successfully",
    data: result,
  });
});

// GET /order/my-orders — Get user's orders (paginated)
const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.user?.userId;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await orderService.getMyOrdersFromDB(
    userId as string,
    page,
    limit,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Orders retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

// GET /order/my-orders/:id — Get single order detail
const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req?.user?.userId;

  const result = await orderService.getOrderByIdFromDB(
    id as string,
    userId as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order retrieved successfully",
    data: result,
  });
});

// PATCH /order/my-orders/:id/cancel — Cancel a pending order
const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req?.user?.userId;

  const result = await orderService.cancelOrderIntoDB(
    id as string,
    userId as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order cancelled successfully",
    data: result,
  });
});

// ========== ADMIN ENDPOINTS ==========

// GET /order/admin/all — Get all orders (paginated + filtered)
const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const orderStatus = req.query.orderStatus as string | undefined;
  const paymentStatus = req.query.paymentStatus as string | undefined;

  const result = await orderService.getAllOrdersFromDB(page, limit, {
    orderStatus,
    paymentStatus,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All orders retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

// PATCH /order/admin/:id/status — Update order status
const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await orderService.updateOrderStatusIntoDB(
    id as string,
    status,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Order status updated to ${status}`,
    data: result,
  });
});

// PATCH /order/admin/:id/payment-status — Update payment status
const updatePaymentStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await orderService.updatePaymentStatusIntoDB(
    id as string,
    status,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Payment status updated to ${status}`,
    data: result,
  });
});

const orderController = {
  checkout,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
};

export default orderController;
