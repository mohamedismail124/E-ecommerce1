import express from "express";
import * as product from "./productController.js";
import { uploadMixOfFiles } from "../../middleware/fileUpload.js";
import { allowedTo, protectedRoutes } from "../auth/authController.js";


 let fieldsArray = [
  { name: "imgCover", maxCount: 1 },
  { name: "images", maxCount: 10 },
];
const productRouter = express.Router();
productRouter
  .route("/")
  .post(protectedRoutes,allowedTo('admin','user'),uploadMixOfFiles(fieldsArray,'product'), product.createProduct)
  .get(product.getAllProducts);
productRouter
  .route("/:id")
  .get(product.getProduct)
  .delete(protectedRoutes,allowedTo('admin'),product.deleteProduct)
  .put(protectedRoutes,allowedTo('admin'),product.updateProduct);
export default productRouter;
