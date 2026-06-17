// create product

import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import productService from "./product.service";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";

const getFileUrl = (file: Express.Multer.File) => `/uploads/${file.filename}`;

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const { name, price, categoryId } = req.body;

  const files = req.files as {
    thumbnail?: Express.Multer.File[];
    productImages?: Express.Multer.File[];
  };
  const thumbnail = files?.thumbnail?.[0];
  const productImages = files?.productImages || [];

  if (!categoryId) {
    throw new AppError(401, "Category id is required");
  }

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  if (!price) {
    throw new AppError(401, "Price is required");
  }
  if (!name) {
    throw new AppError(401, "Title is required");
  }
  if (!thumbnail) {
    throw new AppError(401, "Product thumbnail is required");
  }

  const product = await productService.createProductIntoDB({
    name: req.body.name,
    description: req.body.description,
    price: Number(req.body.price),
    stock: Number(req.body.stock),
    isFeatured:
      req.body.isFeatured === undefined
        ? false
        : req.body.isFeatured === "true",
    thumbnail: getFileUrl(thumbnail),
    productImages: productImages.map(getFileUrl) as string[],
    categoryId: req.body.categoryId,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

//get all products
const getallProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await prisma.product.findMany({
    include: {
      category: {
        select: {
          id: true,
          title: true,
        },
      },
      productImages: {
        select: {
          id: true,
          image: true,
        },
      },
    },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Product retrive successfully",
    data: product,
  });
});
//get all products
const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.id as string;
  await prisma.product.delete({
    where: {
      id: productId,
    },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Product delete successfully",
  });
});

// update product

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.id as string;
  //find the find
  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },

    include: {
      productImages: true,
    },
  });

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  res.end();
});

const productController = {
  createProduct,
  getallProduct,
  deleteProduct,
  updateProduct,
};

export default productController;
