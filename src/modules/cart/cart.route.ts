import { Router } from "express";
import authGurd, { authorize } from "../../middleware/authGurd";
import cartController from "./cart.controller";

const cartRouter = Router();

cartRouter.get("/", authGurd, cartController.getMyCart);
cartRouter.post("/", authGurd, cartController.addToCart);
cartRouter.delete("/:id", authGurd, cartController.removeCartItem);
cartRouter.patch("/:id", authGurd, cartController.updateCartItemQuantity);

export default cartRouter;
