import express from "express";
import * as order from "./orderController.js";
import { allowedTo, protectedRoutes } from "../auth/authController.js";

const orderRouter = express.Router();

orderRouter
  .route("/")
  .get(protectedRoutes, allowedTo("user"), order.getSpecificOrder);

orderRouter.get("/all", order.getAllOrders);

orderRouter
  .route("/:id")
  .post(protectedRoutes, allowedTo("user"), order.createCashOrder);

orderRouter.post(
  "/checkOut/id",
  protectedRoutes,
  allowedTo("user"),
  order.createCheckOutSession
);
export default orderRouter;
