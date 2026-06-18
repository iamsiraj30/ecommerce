import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

type TCreateShippingAddress = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
};

// Create shipping address
const createShippingAddressIntoDB = async (
  userId: string,
  payload: TCreateShippingAddress,
) => {
  const { fullName, phone, addressLine1, city, country, postalCode } = payload;

  if (!fullName) {
    throw new AppError(400, "Full name is required");
  }
  if (!phone) {
    throw new AppError(400, "Phone number is required");
  }
  if (!addressLine1) {
    throw new AppError(400, "Address line 1 is required");
  }
  if (!city) {
    throw new AppError(400, "City is required");
  }
  if (!country) {
    throw new AppError(400, "Country is required");
  }
  if (!postalCode) {
    throw new AppError(400, "Postal code is required");
  }

  const shippingAddress = await prisma.shippingAddress.create({
    data: {
      userId,
      fullName: payload.fullName,
      phone: payload.phone,
      addressLine1: payload.addressLine1,
      addressLine2: payload.addressLine2,
      city: payload.city,
      state: payload.state,
      country: payload.country,
      postalCode: payload.postalCode,
    },
  });

  return shippingAddress;
};

// Get all shipping addresses for a user
const getMyShippingAddressesFromDB = async (userId: string) => {
  const addresses = await prisma.shippingAddress.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return addresses;
};

// Get a single shipping address by ID (with ownership check)
const getShippingAddressByIdFromDB = async (id: string, userId: string) => {
  const address = await prisma.shippingAddress.findUnique({
    where: { id },
  });

  if (!address) {
    throw new AppError(404, "Shipping address not found");
  }

  if (address.userId !== userId) {
    throw new AppError(403, "You don't have access to this shipping address");
  }

  return address;
};

// Update shipping address
const updateShippingAddressIntoDB = async (
  id: string,
  userId: string,
  payload: Partial<TCreateShippingAddress>,
) => {
  const address = await prisma.shippingAddress.findUnique({
    where: { id },
  });

  if (!address) {
    throw new AppError(404, "Shipping address not found");
  }

  if (address.userId !== userId) {
    throw new AppError(403, "You don't have access to this shipping address");
  }

  const updated = await prisma.shippingAddress.update({
    where: { id },
    data: payload,
  });

  return updated;
};

// Delete shipping address (prevent if tied to active orders)
const deleteShippingAddressFromDB = async (id: string, userId: string) => {
  const address = await prisma.shippingAddress.findUnique({
    where: { id },
    include: {
      orders: {
        where: {
          orderStatus: {
            in: ["PENDING", "PROCESSING", "SHIPPED"],
          },
        },
      },
    },
  });

  if (!address) {
    throw new AppError(404, "Shipping address not found");
  }

  if (address.userId !== userId) {
    throw new AppError(403, "You don't have access to this shipping address");
  }

  if (address.orders.length > 0) {
    throw new AppError(
      400,
      "Cannot delete this address because it is linked to active orders",
    );
  }

  await prisma.shippingAddress.delete({
    where: { id },
  });

  return null;
};

const shippingAddressService = {
  createShippingAddressIntoDB,
  getMyShippingAddressesFromDB,
  getShippingAddressByIdFromDB,
  updateShippingAddressIntoDB,
  deleteShippingAddressFromDB,
};

export default shippingAddressService;
