import express from "express";
import * as category from "./categoryController.js";
import subCategoryRouter from "./../subcategory/subcategory.router.js";
import { validation } from "../../middleware/validation.js";
import {
  createCategorySchema,
  getCategorySchema,
  updateCategorySchema,
} from "./category.validation.js";
import { uploadsinglefile } from "../../middleware/fileUpload.js";
import { allowedTo, protectedRoutes } from "../auth/authController.js";

const categoryRouter = express.Router();

categoryRouter.use("/:categoryId/subcategories", subCategoryRouter);
categoryRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("admin"),
    uploadsinglefile("image", "category"),
    validation(createCategorySchema),
    category.createCategory
  )
  .get(category.getAllCategories);
categoryRouter
  .route("/:id")
  .get(validation(getCategorySchema), category.getCategory)
  .delete(protectedRoutes, allowedTo("admin"), category.deleteCategory)
  .put(
    protectedRoutes,
    allowedTo("admin"),
    uploadsinglefile("image", "category"),
    validation(updateCategorySchema),
    category.updateCategory
  );
export default categoryRouter;
