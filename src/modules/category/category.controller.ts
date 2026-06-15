import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import catchAsync from "../../utils/catchAsync";

// create category controller
const createCategory = catchAsync(async (req: Request, res: Response) => {
  const { title, description, thumbnail } = req.body;
  const category = await prisma.category.create({
    data: {
      title,
      description,
      thumbnail,
    },
  });
  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

// get all category controller
const getAllCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await prisma.category.findMany();
  res.status(201).json({
    success: true,
    data: category,
  });
});

// update category controller
const categoryUpdateById = catchAsync(async (req: Request, res: Response) => {
  const category = await prisma.category.findUnique({
    where: {
      id: req.params.id as string,
    },
  });

  if (!category) {
    throw new Error("Category not found!");
  }

  const update = await prisma.category.update({
    where: {
      id: req.params.id as string,
    },
    data: {
      title: req.body.title,
      description: req.body.description,
    },
  });

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

  await prisma.category.delete({
    where: {
      id: req.params.id as string,
    },
  });

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
