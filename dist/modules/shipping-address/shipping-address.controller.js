"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const shipping_address_service_1 = __importDefault(require("./shipping-address.service"));
const createShippingAddress = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req?.user?.userId;
    const result = await shipping_address_service_1.default.createShippingAddressIntoDB(userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Shipping address created successfully",
        data: result,
    });
});
const getMyShippingAddresses = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req?.user?.userId;
    const result = await shipping_address_service_1.default.getMyShippingAddressesFromDB(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Shipping addresses retrieved successfully",
        data: result,
    });
});
const getShippingAddressById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const userId = req?.user?.userId;
    const result = await shipping_address_service_1.default.getShippingAddressByIdFromDB(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Shipping address retrieved successfully",
        data: result,
    });
});
const updateShippingAddress = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const userId = req?.user?.userId;
    const result = await shipping_address_service_1.default.updateShippingAddressIntoDB(id, userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Shipping address updated successfully",
        data: result,
    });
});
const deleteShippingAddress = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const userId = req?.user?.userId;
    await shipping_address_service_1.default.deleteShippingAddressFromDB(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Shipping address deleted successfully",
        data: null,
    });
});
const shippingAddressController = {
    createShippingAddress,
    getMyShippingAddresses,
    getShippingAddressById,
    updateShippingAddress,
    deleteShippingAddress,
};
exports.default = shippingAddressController;
