import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../errors/AppError";
import sendResponse from "../../utils/sendResponse";

// create category controller
const addTowishlist = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.body;
  const userId = req?.user?.userId;

  if (!userId) {
    throw new AppError(401, "Please login to add wishlist");
  }
  if (!productId) {
    throw new AppError(401, "Please select a product");
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new AppError(401, "Product not Found");
  }

  // check product already in wishlist

  const exist = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (exist) {
    throw new AppError(409, "Product already exists in wishlist");
  }

  await prisma.wishlist.create({
    data: {
      userId,
      productId,
    },
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Product added to wishlist",
  });
});

// get all category controller
const getWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.user?.userId;

  if (!userId) {
    throw new AppError(401, "Please login first");
  }

  const wishlistProduct = await prisma.wishlist.findMany({
    where: {
      userId,
    },
    include: {
      product: true,
    },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All Category retrieved successfully",
    data: wishlistProduct,
  });
});

// delete from wishlist by id
const deleteWishlistById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req?.user?.userId;

  if (!userId) {
    throw new AppError(401, "Please login to add wishlist");
  }

  const productInWishlist = await prisma.wishlist.findUnique({
    where: {
      id: id as string,
    },
  });

  if (!productInWishlist) {
    throw new AppError(401, "Product not found");
  }

  await prisma.wishlist.delete({
    where: {
      id: id as string,
      userId,
    },
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Product removed from wishlist",
  });
});

// delete from wishlist by id
const deleteAllWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  console.log(userId);
  if (!userId) {
    throw new AppError(401, "Please login first");
  }

  const result = await prisma.wishlist.deleteMany({
    where: {
      userId,
    },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All wishlist items removed successfully",
    data: {
      deletedCount: result.count,
    },
  });
});

const wishlistController = {
  addTowishlist,
  getWishlist,
  deleteWishlistById,
  deleteAllWishlist,
};

export default wishlistController;
