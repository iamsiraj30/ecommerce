import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
const createCategory = async (req: Request, res: Response) => {
  try {
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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const getAllCategory = async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.findMany();

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const categoryUpdateById = async (req: Request, res: Response) => {
  try {
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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const categoryDeleteById = async (req: Request, res: Response) => {
  try {
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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const categoryController = {
  createCategory,
  getAllCategory,
  categoryUpdateById,
  categoryDeleteById,
};

export default categoryController;
