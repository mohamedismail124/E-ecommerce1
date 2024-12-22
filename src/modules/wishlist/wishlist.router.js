import express from "express";
import * as wishlist from "./wishlistController.js";
import { allowedTo, protectedRoutes } from "../auth/authController.js";



const wishlistRouter = express.Router();

wishlistRouter
  .route("/")       
  .patch(protectedRoutes,allowedTo('user'),wishlist.addToWishlist) 
  .delete(protectedRoutes,allowedTo('user'),wishlist.removeFromWishlist)  
  .get(protectedRoutes,allowedTo('user'),wishlist.getAllUserWishlist)  




export default wishlistRouter;
