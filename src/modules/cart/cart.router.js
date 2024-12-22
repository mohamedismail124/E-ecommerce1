import express from "express";
import * as cart from "./cartController.js";
import { allowedTo, protectedRoutes } from "../auth/authController.js";

const cartRouter = express.Router();

cartRouter
  .route("/")
  .post(protectedRoutes, allowedTo("user"), cart.addProductToCart)
  .get(protectedRoutes, allowedTo("user"), cart.getLoggedUserCart);
cartRouter.post(
  "/applyCoupon",
  protectedRoutes,
  allowedTo("user"),
  cart.applyCoupon
);

cartRouter
  .route("/:id")
  .delete(protectedRoutes, allowedTo("user"), cart.removeProductFromCart)
  .put(protectedRoutes, allowedTo("user"), cart.updateQuantity);

export default cartRouter;
