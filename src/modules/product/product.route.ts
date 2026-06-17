import { Router } from "express";
import productController from "./product.controller";
import { upload } from "../../utils/multer";
import authGurd, { authorize } from "../../middleware/authGurd";

const productRouter = Router();

productRouter.post(
  "/",
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "productImages",
      maxCount: 10,
    },
  ]),
  authGurd,
  authorize("ADMIN"),
  productController.createProduct,
);

// get all products
productRouter.get("/", productController.getallProduct);
productRouter.delete("/:id", productController.deleteProduct);

export default productRouter;
