import { Router } from "express";
import authGurd from "../../middleware/authGurd";
import shippingAddressController from "./shipping-address.controller";

const shippingAddressRouter = Router();

shippingAddressRouter.post(
  "/",
  authGurd,
  shippingAddressController.createShippingAddress,
);

shippingAddressRouter.get(
  "/",
  authGurd,
  shippingAddressController.getMyShippingAddresses,
);

shippingAddressRouter.get(
  "/:id",
  authGurd,
  shippingAddressController.getShippingAddressById,
);

shippingAddressRouter.patch(
  "/:id",
  authGurd,
  shippingAddressController.updateShippingAddress,
);

shippingAddressRouter.delete(
  "/:id",
  authGurd,
  shippingAddressController.deleteShippingAddress,
);

export default shippingAddressRouter;
