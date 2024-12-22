import  express  from "express";
import * as auth from "./authController.js";


const authRouter = express.Router();

authRouter.post("/singUp", auth.signUp);
authRouter.post("/singIn", auth.signIn);

export default authRouter