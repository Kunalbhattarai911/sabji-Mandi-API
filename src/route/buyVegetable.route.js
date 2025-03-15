import { Router } from "express";
import { buyVegetable } from "../controller/buyVegetable.controller.js";

const buyVegetableRouter = Router();

buyVegetableRouter.route("/buy").post(buyVegetable);

export default buyVegetableRouter;
