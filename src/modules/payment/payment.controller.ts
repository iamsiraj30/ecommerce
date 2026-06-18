import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import paymentService from "./payment.service";

// ========== USER ENDPOINTS ==========

// GET /payment/order/:orderId — Get payments for a specific order
const getPaymentsByOrderId = catchAsync(
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const userId = req?.user?.userId;

    const result = await paymentService.getPaymentsByOrderId(
      orderId as string,
      userId as string,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Payments retrieved successfully",
      data: result,
    });
  },
);

// GET /payment/my-payments — Get all my payments (paginated)
const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.user?.userId;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await paymentService.getMyPaymentsFromDB(
    userId as string,
    page,
    limit,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payments retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

// PATCH /payment/cod/:orderId/confirm — Confirm COD payment
const confirmCodPayment = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const userId = req?.user?.userId;

  const result = await paymentService.confirmCodPayment(
    orderId as string,
    userId as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "COD payment confirmed successfully",
    data: result,
  });
});

// ========== ADMIN ENDPOINTS ==========

// GET /payment/admin/all — Get all payments (paginated + filtered)
const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const status = req.query.status as string | undefined;
  const provider = req.query.provider as string | undefined;

  const result = await paymentService.getAllPaymentsFromDB(page, limit, {
    status,
    provider,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All payments retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

// GET /payment/admin/:id — Get single payment detail
const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await paymentService.getPaymentByIdFromDB(id as string);

  sendResponse(res, {
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

export default paymentController;
