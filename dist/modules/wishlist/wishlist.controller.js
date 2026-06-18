"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../lib/prisma");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
// create category controller
const addTowishlist = (0, catchAsync_1.default)(async (req, res) => {
    const { productId } = req.body;
    const userId = req?.user?.userId;
    if (!userId) {
        throw new AppError_1.default(401, "Please login to add wishlist");
    }
    if (!productId) {
        throw new AppError_1.default(401, "Please select a product");
    }
    const product = await prisma_1.prisma.product.findUnique({
        where: {
            id: productId,
        },
    });
    if (!product) {
        throw new AppError_1.default(401, "Product not Found");
    }
    // check product already in wishlist
    const exist = await prisma_1.prisma.wishlist.findUnique({
        where: {
            userId_productId: {
                userId,
                productId,
            },
        },
    });
    if (exist) {
        throw new AppError_1.default(409, "Product already exists in wishlist");
    }
    await prisma_1.prisma.wishlist.create({
        data: {
            userId,
            productId,
        },
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Product added to wishlist",
    });
});
// get all category controller
const getWishlist = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req?.user?.userId;
    if (!userId) {
        throw new AppError_1.default(401, "Please login first");
    }
    const wishlistProduct = await prisma_1.prisma.wishlist.findMany({
        where: {
            userId,
        },
        include: {
            product: true,
        },
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All Category retrieved successfully",
        data: wishlistProduct,
    });
});
// delete from wishlist by id
const deleteWishlistById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const userId = req?.user?.userId;
    if (!userId) {
        throw new AppError_1.default(401, "Please login to add wishlist");
    }
    const productInWishlist = await prisma_1.prisma.wishlist.findUnique({
        where: {
            id: id,
        },
    });
    if (!productInWishlist) {
        throw new AppError_1.default(401, "Product not found");
    }
    await prisma_1.prisma.wishlist.delete({
        where: {
            id: id,
            userId,
        },
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Product removed from wishlist",
    });
});
// delete from wishlist by id
const deleteAllWishlist = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.userId;
    console.log(userId);
    if (!userId) {
        throw new AppError_1.default(401, "Please login first");
    }
    const result = await prisma_1.prisma.wishlist.deleteMany({
        where: {
            userId,
        },
    });
    (0, sendResponse_1.default)(res, {
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
exports.default = wishlistController;
