"use strict";
// create product
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const product_service_1 = __importDefault(require("./product.service"));
const prisma_1 = require("../../lib/prisma");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const getFileUrl = (file) => `/uploads/${file.filename}`;
const createProduct = (0, catchAsync_1.default)(async (req, res) => {
    const { name, price, categoryId } = req.body;
    const files = req.files;
    const thumbnail = files?.thumbnail?.[0];
    const productImages = files?.productImages || [];
    if (!categoryId) {
        throw new AppError_1.default(401, "Category id is required");
    }
    const category = await prisma_1.prisma.category.findUnique({
        where: {
            id: categoryId,
        },
    });
    if (!category) {
        throw new AppError_1.default(404, "Category not found");
    }
    if (!price) {
        throw new AppError_1.default(401, "Price is required");
    }
    if (!name) {
        throw new AppError_1.default(401, "Title is required");
    }
    if (!thumbnail) {
        throw new AppError_1.default(401, "Product thumbnail is required");
    }
    const product = await product_service_1.default.createProductIntoDB({
        name: req.body.name,
        description: req.body.description,
        price: Number(req.body.price),
        stock: Number(req.body.stock),
        isFeatured: req.body.isFeatured === undefined
            ? false
            : req.body.isFeatured === "true",
        thumbnail: getFileUrl(thumbnail),
        productImages: productImages.map(getFileUrl),
        categoryId: req.body.categoryId,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Product created successfully",
        data: product,
    });
});
//get all products
const getallProduct = (0, catchAsync_1.default)(async (req, res) => {
    const product = await prisma_1.prisma.product.findMany({
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
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Product retrive successfully",
        data: product,
    });
});
//get all products
const deleteProduct = (0, catchAsync_1.default)(async (req, res) => {
    const productId = req.params.id;
    await prisma_1.prisma.product.delete({
        where: {
            id: productId,
        },
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Product delete successfully",
    });
});
// update product
const updateProduct = (0, catchAsync_1.default)(async (req, res) => {
    const productId = req.params.id;
    //find the find
    const existingProduct = await prisma_1.prisma.product.findUnique({
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
exports.default = productController;
