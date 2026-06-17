import { prisma } from "../../lib/prisma";

type TCreateProductPayload = {
  name: string;
  description: string;
  price: number;
  stock: number;
  isFeatured?: boolean;
  thumbnail: string;
  productImages: string[];
  categoryId: string;
};

const createProductIntoDB = async (payload: TCreateProductPayload) => {
  const product = await prisma.product.create({
    data: {
      name: payload.name,
      description: payload.description,
      price: payload.price,
      stock: payload.stock,
      isFeatured: payload.isFeatured,
      thumbnail: payload.thumbnail,
      categoryId: payload.categoryId,
      productImages: {
        create: payload.productImages.map((image) => ({
          image,
        })),
      },
    },
    include: {
      productImages: true,
      category: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return product;
};

const productService = {
  createProductIntoDB,
};

export default productService;
