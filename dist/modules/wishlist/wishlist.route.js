"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authGurd_1 = __importDefault(require("../../middleware/authGurd"));
const wishlist_controller_1 = __importDefault(require("./wishlist.controller"));
const wishlistRouter = (0, express_1.Router)();
wishlistRouter.post("/", authGurd_1.default, wishlist_controller_1.default.addTowishlist);
wishlistRouter.get("/", authGurd_1.default, wishlist_controller_1.default.getWishlist);
wishlistRouter.delete("/all", authGurd_1.default, wishlist_controller_1.default.deleteAllWishlist);
wishlistRouter.delete("/:id", authGurd_1.default, wishlist_controller_1.default.deleteWishlistById);
exports.default = wishlistRouter;
