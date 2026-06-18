"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const payment_service_1 = __importDefault(require("./payment.service"));
// ========== USER ENDPOINTS ==========
// GET /payment/order/:orderId — Get payments for a specific order
const getPaymentsByOrderId = (0, catchAsync_1.default)(async (req, res) => {
    const { orderId } = req.params;
    const userId = req?.user?.userId;
    const result = await payment_service_1.default.getPaymentsByOrderId(orderId, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Payments retrieved successfully",
        data: result,
    });
});
// GET /payment/my-payments — Get all my payments (paginated)
const getMyPayments = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req?.user?.userId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await payment_service_1.default.getMyPaymentsFromDB(userId, page, limit);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Payments retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});
// PATCH /payment/cod/:orderId/confirm — Confirm COD payment
const confirmCodPayment = (0, catchAsync_1.default)(async (req, res) => {
    const { orderId } = req.params;
    const userId = req?.user?.userId;
    const result = await payment_service_1.default.confirmCodPayment(orderId, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "COD payment confirmed successfully",
        data: result,
    });
});
// ========== ADMIN ENDPOINTS ==========
// GET /payment/admin/all — Get all payments (paginated + filtered)
const getAllPayments = (0, catchAsync_1.default)(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status;
    const provider = req.query.provider;
    const result = await payment_service_1.default.getAllPaymentsFromDB(page, limit, {
        status,
        provider,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All payments retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});
// GET /payment/admin/:id — Get single payment detail
const getPaymentById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await payment_service_1.default.getPaymentByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Payment retrieved successfully",
        data: result,
    });
});
const paymentController = {
    getPaymentsByOrderId,
    getMyPayments,
    confirmCodPayment,
    getAllPayments,
    getPaymentById,
};
exports.default = paymentController;
