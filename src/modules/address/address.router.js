import express from "express";
import * as addresses from "./addressController.js";
import { allowedTo, protectedRoutes } from "../auth/authController.js";



const addressRouter = express.Router();

addressRouter
  .route("/")       
  .patch(protectedRoutes,allowedTo('user'),addresses.addAddress) 
  .delete(protectedRoutes,allowedTo('user'),addresses.removeAddress)  
  .get(protectedRoutes,allowedTo('user'),addresses.getAllUserAddress)  




export default addressRouter;
