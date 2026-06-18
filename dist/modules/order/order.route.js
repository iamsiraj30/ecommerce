"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authGurd_1 = __importStar(require("../../middleware/authGurd"));
const order_controller_1 = __importDefault(require("./order.controller"));
const orderRouter = (0, express_1.Router)();
// ========== USER ROUTES ==========
// POST /order/checkout — Create order from cart
orderRouter.post("/checkout", authGurd_1.default, order_controller_1.default.checkout);
// GET /order/my-orders — Get user's orders (paginated)
orderRouter.get("/my-orders", authGurd_1.default, order_controller_1.default.getMyOrders);
// GET /order/my-orders/:id — Get single order detail
orderRouter.get("/my-orders/:id", authGurd_1.default, order_controller_1.default.getOrderById);
// PATCH /order/my-orders/:id/cancel — Cancel a pending order
orderRouter.patch("/my-orders/:id/cancel", authGurd_1.default, order_controller_1.default.cancelOrder);
// ========== ADMIN ROUTES ==========
// GET /order/admin/all — Get all orders (paginated + filtered)
orderRouter.get("/admin/all", authGurd_1.default, (0, authGurd_1.authorize)("ADMIN"), order_controller_1.default.getAllOrders);
// PATCH /order/admin/:id/status — Update order status
orderRouter.patch("/admin/:id/status", authGurd_1.default, (0, authGurd_1.authorize)("ADMIN"), order_controller_1.default.updateOrderStatus);
// PATCH /order/admin/:id/payment-status — Update payment status
orderRouter.patch("/admin/:id/payment-status", authGurd_1.default, (0, authGurd_1.authorize)("ADMIN"), order_controller_1.default.updatePaymentStatus);
exports.default = orderRouter;
