"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authGurd_1 = __importDefault(require("../../middleware/authGurd"));
const shipping_address_controller_1 = __importDefault(require("./shipping-address.controller"));
const shippingAddressRouter = (0, express_1.Router)();
shippingAddressRouter.post("/", authGurd_1.default, shipping_address_controller_1.default.createShippingAddress);
shippingAddressRouter.get("/", authGurd_1.default, shipping_address_controller_1.default.getMyShippingAddresses);
shippingAddressRouter.get("/:id", authGurd_1.default, shipping_address_controller_1.default.getShippingAddressById);
shippingAddressRouter.patch("/:id", authGurd_1.default, shipping_address_controller_1.default.updateShippingAddress);
shippingAddressRouter.delete("/:id", authGurd_1.default, shipping_address_controller_1.default.deleteShippingAddress);
exports.default = shippingAddressRouter;
