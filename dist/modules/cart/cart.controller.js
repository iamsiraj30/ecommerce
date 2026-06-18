"use strict";
// create product
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const cart_service_1 = __importDefault(require("./cart.service"));
const addToCart = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req?.user?.userId;
    const result = await cart_service_1.default.addToCartIntoDB(userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Product added to cart successfully",
        data: result,
    });
});
const getMyCart = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req?.user?.userId;
    const result = await cart_service_1.default.getMyCartFromDB(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Cart retrieved successfully",
        data: result,
    });
});
const updateCartItemQuantity = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const { action } = req.body;
    const userId = req?.user?.userId;
    if (action !== "increase" && action !== "decrease") {
        throw new AppError_1.default(400, "Action must be increase or decrease");
    }
    const result = await cart_service_1.default.updateCartItemQuantityIntoDB(id, action, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: action === "increase"
            ? "Cart quantity increased successfully"
            : "Cart quantity decreased successfully",
        data: result,
    });
});
const removeCartItem = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const userId = req?.user?.userId;
    await cart_service_1.default.removeCartItemFromDB(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Cart item removed successfully",
        data: null,
    });
});
const cartController = {
    addToCart,
    getMyCart,
    updateCartItemQuantity,
    removeCartItem,
};
exports.default = cartController;
