"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../lib/prisma");
// create new category
const createCategoryIntoDB = async (payload) => {
    const category = await prisma_1.prisma.category.create({
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
        prisma_1.prisma.category.findMany({
            skip,
            take: limit,
        }),
        prisma_1.prisma.category.count(),
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
const updateCategoryFromDB = async (payload, id) => {
    const category = await prisma_1.prisma.category.update({
        where: {
            id: id,
        },
        data: payload,
    });
    return category;
};
// delete category from DB
const deleteCategory = async (payload) => {
    await prisma_1.prisma.category.delete({
        where: {
            id: payload,
        },
    });
};
const categoryService = {
    createCategoryIntoDB,
    getCategoryFromBD,
    updateCategoryFromDB,
    deleteCategory,
};
exports.default = categoryService;
