"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = require("../../lib/prisma");
const addToCartIntoDB = async (userId, payload) => {
    const { productId, quantity } = payload;
    //  Product exists?
    const product = await prisma_1.prisma.product.findUnique({
        where: {
            id: productId,
        },
    });
    if (!product) {
        throw new AppError_1.default(404, "Product not found");
    }
    //  Stock validation
    if (product.stock < quantity) {
        throw new AppError_1.default(400, "Insufficient stock");
    }
    //  Find cart
    let cart = await prisma_1.prisma.cart.findUnique({
        where: {
            userId,
        },
    });
    // Create cart if not exists
    if (!cart) {
        cart = await prisma_1.prisma.cart.create({
            data: {
                userId,
            },
        });
    }
    // Check existing item
    const existingItem = await prisma_1.prisma.cartItem.findUnique({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId,
            },
        },
    });
    // Update quantity
    if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
            throw new AppError_1.default(400, "Insufficient stock");
        }
        return prisma_1.prisma.cartItem.update({
            where: {
                id: existingItem.id,
            },
            data: {
                quantity: newQuantity,
            },
        });
    }
    // Create new cart item
    return prisma_1.prisma.cartItem.create({
        data: {
            cartId: cart.id,
            productId,
            quantity,
        },
    });
};
const getMyCartFromDB = async (userId) => {
    const cart = await prisma_1.prisma.cart.findUnique({
        where: {
            userId,
        },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    });
    if (!cart) {
        return {
            items: [],
            totalQuantity: 0,
            totalPrice: 0,
        };
    }
    const items = cart.items.map((item) => {
        const price = Number(item.product.price || 0);
        return {
            ...item,
            subTotal: item.quantity * price,
        };
    });
    const totalQuantity = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.items.reduce((acc, item) => {
        const price = item.product.price ?? 0;
        return acc + item.quantity * price;
    }, 0);
    return {
        id: cart.id,
        items,
        totalQuantity,
        totalPrice,
    };
};
// cart quantity
const updateCartItemQuantityIntoDB = async (cartItemId, action, userId) => {
    const cartItem = await prisma_1.prisma.cartItem.findUnique({
        where: {
            id: cartItemId,
        },
        include: {
            cart: true,
            product: true,
        },
    });
    if (!cartItem) {
        throw new AppError_1.default(404, "Cart item not found");
    }
    // Security check
    if (cartItem.cart.userId !== userId) {
        throw new AppError_1.default(403, "Forbidden");
    }
    if (action === "increase") {
        if (cartItem.quantity >= cartItem.product.stock) {
            throw new AppError_1.default(400, "Insufficient stock");
        }
        return prisma_1.prisma.cartItem.update({
            where: {
                id: cartItemId,
            },
            data: {
                quantity: {
                    increment: 1,
                },
            },
        });
    }
    // decrease
    if (cartItem.quantity === 1) {
        await prisma_1.prisma.cartItem.delete({
            where: {
                id: cartItemId,
            },
        });
        return null;
    }
    return prisma_1.prisma.cartItem.update({
        where: {
            id: cartItemId,
        },
        data: {
            quantity: {
                decrement: 1,
            },
        },
    });
};
const removeCartItemFromDB = async (cartItemId, userId) => {
    const cartItem = await prisma_1.prisma.cartItem.findUnique({
        where: {
            id: cartItemId,
        },
        include: {
            cart: true,
        },
    });
    if (!cartItem) {
        throw new AppError_1.default(404, "Cart item not found");
    }
    // ownership check
    if (cartItem.cart.userId !== userId) {
        throw new AppError_1.default(403, "Forbidden");
    }
    await prisma_1.prisma.cartItem.delete({
        where: {
            id: cartItemId,
        },
    });
    return null;
};
const cartService = {
    addToCartIntoDB,
    getMyCartFromDB,
    updateCartItemQuantityIntoDB,
    removeCartItemFromDB,
};
exports.default = cartService;
