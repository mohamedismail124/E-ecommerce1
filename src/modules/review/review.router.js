import express from "express";
import * as review from "./reviewController.js";
import { allowedTo, protectedRoutes } from "../auth/authController.js";



const reviewRouter = express.Router();

reviewRouter
  .route("/")       
  .post(protectedRoutes,allowedTo('user'),review.createReview) 
  .get(review.getAllReviews);

reviewRouter
  .route("/:id")
  .get(review.getReview)
  .delete(protectedRoutes,allowedTo('user'),review.deleteReview)
  .put(protectedRoutes,allowedTo('admin','user'),review.updateReview);

export default reviewRouter;
