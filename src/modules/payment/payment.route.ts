import { Router } from "express";
import authGurd, { authorize } from "../../middleware/authGurd";
import paymentController from "./payment.controller";

const paymentRouter = Router();

paymentRouter.get(
  "/order/:orderId",
  authGurd,
  paymentController.getPaymentsByOrderId,
);

paymentRouter.get("/my-payments", authGurd, paymentController.getMyPayments);

paymentRouter.patch(
  "/cod/:orderId/confirm",
  authGurd,
  paymentController.confirmCodPayment,
);

paymentRouter.get(
  "/admin/all",
  authGurd,
  authorize("ADMIN"),
  paymentController.getAllPayments,
);

paymentRouter.get(
  "/admin/:id",
  authGurd,
  authorize("ADMIN"),
  paymentController.getPaymentById,
);

export default paymentRouter;
