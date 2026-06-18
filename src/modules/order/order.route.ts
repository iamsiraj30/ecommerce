import { Router } from "express";
import authGurd, { authorize } from "../../middleware/authGurd";
import orderController from "./order.controller";

const orderRouter = Router();

// ========== USER ROUTES ==========

// POST /order/checkout — Create order from cart
orderRouter.post("/checkout", authGurd, orderController.checkout);

// GET /order/my-orders — Get user's orders (paginated)
orderRouter.get("/my-orders", authGurd, orderController.getMyOrders);

// GET /order/my-orders/:id — Get single order detail
orderRouter.get("/my-orders/:id", authGurd, orderController.getOrderById);

// PATCH /order/my-orders/:id/cancel — Cancel a pending order
orderRouter.patch(
  "/my-orders/:id/cancel",
  authGurd,
  orderController.cancelOrder,
);

// ========== ADMIN ROUTES ==========

// GET /order/admin/all — Get all orders (paginated + filtered)
orderRouter.get(
  "/admin/all",
  authGurd,
  authorize("ADMIN"),
  orderController.getAllOrders,
);

// PATCH /order/admin/:id/status — Update order status
orderRouter.patch(
  "/admin/:id/status",
  authGurd,
  authorize("ADMIN"),
  orderController.updateOrderStatus,
);

// PATCH /order/admin/:id/payment-status — Update payment status
orderRouter.patch(
  "/admin/:id/payment-status",
  authGurd,
  authorize("ADMIN"),
  orderController.updatePaymentStatus,
);

export default orderRouter;
