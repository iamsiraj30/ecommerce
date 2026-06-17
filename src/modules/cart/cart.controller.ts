// create product

import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../errors/AppError";
import cartService from "./cart.service";
import { prisma } from "../../lib/prisma";

const addToCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.user?.userId;

  const result = await cartService.addToCartIntoDB(userId as string, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Product added to cart successfully",
    data: result,
  });
});

const getMyCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.user?.userId;

  const result = await cartService.getMyCartFromDB(userId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Cart retrieved successfully",
    data: result,
  });
});

const updateCartItemQuantity = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { action } = req.body;

    const userId = req?.user?.userId;

    if (action !== "increase" && action !== "decrease") {
      throw new AppError(400, "Action must be increase or decrease");
    }

    const result = await cartService.updateCartItemQuantityIntoDB(
      id as string,
      action,
      userId as string,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message:
        action === "increase"
          ? "Cart quantity increased successfully"
          : "Cart quantity decreased successfully",
      data: result,
    });
  },
);
const removeCartItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const userId = req?.user?.userId;

  await cartService.removeCartItemFromDB(id as string, userId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Cart item removed successfully",
    data: null,
  });
});

const cartController = {
  addToCart,
  getMyCart,
  updateCartItemQuantity,
  removeCartItem,
};

export default cartController;
