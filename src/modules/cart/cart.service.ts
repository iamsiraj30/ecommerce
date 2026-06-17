import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

const addToCartIntoDB = async (
  userId: string,
  payload: {
    productId: string;
    quantity: number;
  },
) => {
  const { productId, quantity } = payload;

  //  Product exists?
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  //  Stock validation
  if (product.stock < quantity) {
    throw new AppError(400, "Insufficient stock");
  }

  //  Find cart
  let cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
  });

  // Create cart if not exists
  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
      },
    });
  }

  // Check existing item
  const existingItem = await prisma.cartItem.findUnique({
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
      throw new AppError(400, "Insufficient stock");
    }

    return prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: newQuantity,
      },
    });
  }

  // Create new cart item
  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });
};

const getMyCartFromDB = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
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

  const totalQuantity = cart.items.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );

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
const updateCartItemQuantityIntoDB = async (
  cartItemId: string,
  action: "increase" | "decrease",
  userId: string,
) => {
  const cartItem = await prisma.cartItem.findUnique({
    where: {
      id: cartItemId,
    },
    include: {
      cart: true,
      product: true,
    },
  });

  if (!cartItem) {
    throw new AppError(404, "Cart item not found");
  }

  // Security check
  if (cartItem.cart.userId !== userId) {
    throw new AppError(403, "Forbidden");
  }

  if (action === "increase") {
    if (cartItem.quantity >= cartItem.product.stock) {
      throw new AppError(400, "Insufficient stock");
    }

    return prisma.cartItem.update({
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
    await prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });

    return null;
  }

  return prisma.cartItem.update({
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
const removeCartItemFromDB = async (cartItemId: string, userId: string) => {
  const cartItem = await prisma.cartItem.findUnique({
    where: {
      id: cartItemId,
    },
    include: {
      cart: true,
    },
  });

  if (!cartItem) {
    throw new AppError(404, "Cart item not found");
  }

  // ownership check
  if (cartItem.cart.userId !== userId) {
    throw new AppError(403, "Forbidden");
  }

  await prisma.cartItem.delete({
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

export default cartService;
