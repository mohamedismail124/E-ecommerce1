import express from "express";
import * as subcategory from "./subcategoryController.js";




const subCategoryRouter = express.Router({ mergeParams: true });
subCategoryRouter
  .route("/")
  .post(subcategory.createSubCategory)
  .get(subcategory.getAllSubCategories);
subCategoryRouter
  .route("/:id")
  .get(subcategory.getSubCategory)
  .delete(subcategory.deleteSubCategory)
  .put(subcategory.updatesSubCategory);
export default subCategoryRouter;
