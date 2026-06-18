"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../lib/prisma");
const createProductIntoDB = async (payload) => {
    const product = await prisma_1.prisma.product.create({
        data: {
            name: payload.name,
            description: payload.description,
            price: payload.price,
            stock: payload.stock,
            isFeatured: payload.isFeatured,
            thumbnail: payload.thumbnail,
            categoryId: payload.categoryId,
            productImages: {
                create: payload.productImages.map((image) => ({
                    image,
                })),
            },
        },
        include: {
            productImages: true,
            category: {
                select: {
                    id: true,
                    title: true,
                },
            },
        },
    });
    return product;
};
const productService = {
    createProductIntoDB,
};
exports.default = productService;
