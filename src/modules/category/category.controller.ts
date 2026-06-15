import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import catchAsync from "../../utils/catchAsync";
import categoryService from "./category.service";
import AppError from "../../errors/AppError";

// create category controller
const createCategory = catchAsync(async (req: Request, res: Response) => {
 
  const category = await categoryService.createCategoryIntoDB(req.body) 

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

// get all category controller
const getAllCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.getCategoryFromBD()
  res.status(201).json({
    success: true,
    data: category,
  });
});

// update category controller
const categoryUpdateById = catchAsync(async (req: Request, res: Response) => {
  const update =  await categoryService.updateCategoryFromDB(req.params.id as string)
  res.status(201).json({
    success: true,
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

  await categoryService.deleteCategory(req.params.id as string)

  res.status(201).json({
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
