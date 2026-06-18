"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const order_service_1 = __importDefault(require("./order.service"));
// ========== USER ENDPOINTS ==========
// POST /order/checkout — Create order from cart
const checkout = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req?.user?.userId;
    const result = await order_service_1.default.checkoutFromCart(userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Order placed successfully",
        data: result,
    });
});
// GET /order/my-orders — Get user's orders (paginated)
const getMyOrders = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req?.user?.userId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await order_service_1.default.getMyOrdersFromDB(userId, page, limit);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Orders retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});
// GET /order/my-orders/:id — Get single order detail
const getOrderById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const userId = req?.user?.userId;
    const result = await order_service_1.default.getOrderByIdFromDB(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Order retrieved successfully",
        data: result,
    });
});
// PATCH /order/my-orders/:id/cancel — Cancel a pending order
const cancelOrder = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const userId = req?.user?.userId;
    const result = await order_service_1.default.cancelOrderIntoDB(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Order cancelled successfully",
        data: result,
    });
});
// ========== ADMIN ENDPOINTS ==========
// GET /order/admin/all — Get all orders (paginated + filtered)
const getAllOrders = (0, catchAsync_1.default)(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const orderStatus = req.query.orderStatus;
    const paymentStatus = req.query.paymentStatus;
    const result = await order_service_1.default.getAllOrdersFromDB(page, limit, {
        orderStatus,
        paymentStatus,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All orders retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});
// PATCH /order/admin/:id/status — Update order status
const updateOrderStatus = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await order_service_1.default.updateOrderStatusIntoDB(id, status);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: `Order status updated to ${status}`,
        data: result,
    });
});
// PATCH /order/admin/:id/payment-status — Update payment status
const updatePaymentStatus = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await order_service_1.default.updatePaymentStatusIntoDB(id, status);
    (0, sendResponse_1.default)(res, {
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
exports.default = orderController;
