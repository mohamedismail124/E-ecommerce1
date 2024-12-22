import express from "express";
import * as coupon from "./couponController.js";
import { allowedTo, protectedRoutes } from "../auth/authController.js";



const couponRouter = express.Router();

couponRouter
  .route("/")       
  .post(protectedRoutes,allowedTo('user'),coupon.createCoupon ) 
  .get(coupon.getAllCoupons);

couponRouter
  .route("/:id")
  .get(coupon.getCoupon)
  .delete(protectedRoutes,allowedTo('user'),coupon.deleteCoupon)
  .put(protectedRoutes,allowedTo('admin','user'),coupon.updateCoupon);

export default couponRouter;
