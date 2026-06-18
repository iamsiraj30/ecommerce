"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authGurd_1 = __importDefault(require("../../middleware/authGurd"));
const cart_controller_1 = __importDefault(require("./cart.controller"));
const cartRouter = (0, express_1.Router)();
cartRouter.get("/", authGurd_1.default, cart_controller_1.default.getMyCart);
cartRouter.post("/", authGurd_1.default, cart_controller_1.default.addToCart);
cartRouter.delete("/:id", authGurd_1.default, cart_controller_1.default.removeCartItem);
cartRouter.patch("/:id", authGurd_1.default, cart_controller_1.default.updateCartItemQuantity);
exports.default = cartRouter;
