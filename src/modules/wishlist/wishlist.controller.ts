import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import catchAsync from "../../utils/catchAsync";
import categoryService from "./category.service";
import sendResponse from "../../utils/sendResponse";

// create category controller
const createCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.createCategoryIntoDB(req.body);
 
    sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Category created successfull",
    data: category,
  });
});

// get all category controller
const getAllCategory = catchAsync(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result =
      await categoryService.getCategoryFromBD(
        page,
        limit
      );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message:
        "All Category retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

// update category controller
const categoryUpdateById = catchAsync(async (req: Request, res: Response) => {

  const payload = req.body;

  const update = await categoryService.updateCategoryFromDB(payload,
    req.params.id as string,
  );


  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category update successfull",
    data: update,
  });
});

// delete category controller
const categoryDeleteById = catchAsync(async (req: Request, res: Response) => {
  const category = await prisma.category.findUnique({
    where: {
      id: req.params.id as string,
    },
  });

  if (!category) {
    throw new Error("Category not found!");
  }

  await categoryService.deleteCategory(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category delete successfull",
  });
});

const categoryController = {
  createCategory,
  getAllCategory,
  categoryUpdateById,
  categoryDeleteById,
};

export default categoryController;
