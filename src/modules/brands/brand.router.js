import express from "express";
import * as brand from "./brandController.js";
import { validation } from './../../middleware/validation.js';
import { createBrandSchema } from "./brand.validation.js";
import { uploadsinglefile } from "../../middleware/fileUpload.js";
import { allowedTo, protectedRoutes } from "../auth/authController.js";

const brandRouter = express.Router();

brandRouter
  .route("/")
  .post(protectedRoutes,allowedTo('admin'),uploadsinglefile('logo','brand'),validation(createBrandSchema), brand.createBrand) 
  .get(brand.getAllBrands);

brandRouter
  .route("/:id")
  .get(brand.getBrand)
  .delete(protectedRoutes,allowedTo('admin'),brand.deleteBrand)
  .put(protectedRoutes,allowedTo('admin'),brand.updateBrand);

export default brandRouter;
