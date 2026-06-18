import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import shippingAddressService from "./shipping-address.service";

const createShippingAddress = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req?.user?.userId;

    const result = await shippingAddressService.createShippingAddressIntoDB(
      userId as string,
      req.body,
    );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Shipping address created successfully",
      data: result,
    });
  },
);

const getMyShippingAddresses = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req?.user?.userId;

    const result = await shippingAddressService.getMyShippingAddressesFromDB(
      userId as string,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Shipping addresses retrieved successfully",
      data: result,
    });
  },
);

const getShippingAddressById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req?.user?.userId;

    const result = await shippingAddressService.getShippingAddressByIdFromDB(
      id as string,
      userId as string,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Shipping address retrieved successfully",
      data: result,
    });
  },
);

const updateShippingAddress = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req?.user?.userId;

    const result = await shippingAddressService.updateShippingAddressIntoDB(
      id as string,
      userId as string,
      req.body,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Shipping address updated successfully",
      data: result,
    });
  },
);

const deleteShippingAddress = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req?.user?.userId;

    await shippingAddressService.deleteShippingAddressFromDB(
      id as string,
      userId as string,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Shipping address deleted successfully",
      data: null,
    });
  },
);

const shippingAddressController = {
  createShippingAddress,
  getMyShippingAddresses,
  getShippingAddressById,
  updateShippingAddress,
  deleteShippingAddress,
};

export default shippingAddressController;
