import { Router } from "express";
import categoryController from "./category.controller";
import authGurd, { authorize } from "../../middleware/authGurd";

const categoryRouter = Router();

// create category - admin
categoryRouter.post(
  "/",
  authGurd,
  authorize("ADMIN"),
  categoryController.createCategory,
);

// get all category
categoryRouter.get("/", categoryController.getAllCategory);

// update category - admin
categoryRouter.patch(
  "/:id",
  authGurd,
  authorize("ADMIN"),
  categoryController.categoryUpdateById,
);

// delete category - admin
categoryRouter.delete(
  "/:id",
  authGurd,
  authorize("ADMIN"),
  categoryController.categoryDeleteById,
);

export default categoryRouter;
