import { Router } from "express";
import { createUser, getBuyData } from "../controller/user.controller.js";

const userRouter = Router();

userRouter.route("/").post(createUser);

userRouter.route("/:id").get(getBuyData);

export default userRouter;
