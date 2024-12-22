import express from "express";
import * as user from "./userController.js";

const userRouter = express.Router();

userRouter.route("/").post(user.createUser).get(user.getAllUsers);

userRouter
  .route("/:id")
  .get(user.getUser)
  .delete(user.deleteUser)
  .put(user.updateUser);

userRouter.patch("/changeUserPassword/:id", user.changeUserPassword);

export default userRouter;
