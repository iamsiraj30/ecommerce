import { Router } from "express";
import authGurd from "../../middleware/authGurd";
import wishlistController from "./wishlist.controller";

const wishlistRouter = Router();

wishlistRouter.post("/", authGurd, wishlistController.addTowishlist);
wishlistRouter.get("/", authGurd, wishlistController.getWishlist);
wishlistRouter.delete("/all", authGurd, wishlistController.deleteAllWishlist);
wishlistRouter.delete("/:id", authGurd, wishlistController.deleteWishlistById);

export default wishlistRouter;
