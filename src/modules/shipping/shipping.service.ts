import { prisma } from "../../lib/prisma";

// create new category
const createCategoryIntoDB = async (payload: {
  title: string;
  description: string;
  thumbnail: string;
}) => {
  const category = await prisma.category.create({
    data: {
      title: payload.title,
      description: payload.description,
      thumbnail: payload.thumbnail,
    },
  });
  return category;
};

// get all category from DB

const getCategoryFromBD = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      skip,
      take: limit,
    }),

    prisma.category.count(),
  ]);

  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: categories,
  };
};

// update category from DB

const updateCategoryFromDB = async (
  payload: { title: string; description: string; thumbnail: string },
  id: string,
) => {
  const category = await prisma.category.update({
    where: {
      id: id as string,
    },
    data: payload,
  });
  return category;
};

// delete category from DB

const deleteCategory = async (payload: string) => {
  await prisma.category.delete({
    where: {
      id: payload as string,
    },
  });
};

const categoryService = {
  createCategoryIntoDB,
  getCategoryFromBD,
  updateCategoryFromDB,
  deleteCategory,
};

export default categoryService;
