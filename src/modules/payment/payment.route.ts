import { Router } from "express";
import authGurd, { authorize } from "../../middleware/authGurd";
import paymentController from "./payment.controller";

const paymentRouter = Router();

// ========== USER ROUTES ==========

// GET /payment/order/:orderId — Get payments for a specific order
paymentRouter.get(
  "/order/:orderId",
  authGurd,
  paymentController.getPaymentsByOrderId,
);

// GET /payment/my-payments — Get all my payments (paginated)
paymentRouter.get("/my-payments", authGurd, paymentController.getMyPayments);

// PATCH /payment/cod/:orderId/confirm — Confirm COD payment
paymentRouter.patch(
  "/cod/:orderId/confirm",
  authGurd,
  paymentController.confirmCodPayment,
);

// ========== ADMIN ROUTES ==========

// GET /payment/admin/all — Get all payments (paginated + filtered)
paymentRouter.get(
  "/admin/all",
  authGurd,
  authorize("ADMIN"),
  paymentController.getAllPayments,
);

// GET /payment/admin/:id — Get single payment detail
paymentRouter.get(
  "/admin/:id",
  authGurd,
  authorize("ADMIN"),
  paymentController.getPaymentById,
);

export default paymentRouter;
