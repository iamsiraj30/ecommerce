"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../lib/prisma");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const category_service_1 = __importDefault(require("./category.service"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
// create category controller
const createCategory = (0, catchAsync_1.default)(async (req, res) => {
    const category = await category_service_1.default.createCategoryIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Category created successfull",
        data: category,
    });
});
// get all category controller
const getAllCategory = (0, catchAsync_1.default)(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await category_service_1.default.getCategoryFromBD(page, limit);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "All Category retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
// update category controller
const categoryUpdateById = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    const update = await category_service_1.default.updateCategoryFromDB(payload, req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Category update successfull",
        data: update,
    });
});
// delete category controller
const categoryDeleteById = (0, catchAsync_1.default)(async (req, res) => {
    const category = await prisma_1.prisma.category.findUnique({
        where: {
            id: req.params.id,
        },
    });
    if (!category) {
        throw new Error("Category not found!");
    }
    await category_service_1.default.deleteCategory(req.params.id);
    (0, sendResponse_1.default)(res, {
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
exports.default = categoryController;
