import { Router } from "express";
import {
  addVegetable,
  deleteVegetable,
  getAllVegetableOfStorage,
  getSingleVegetableOfStorage,
  searchVegetable,
} from "../controller/vegetable.controller.js";

const vegetableRouter = Router();

vegetableRouter.route("/search").get(searchVegetable)

vegetableRouter
  .route("/:storageId")
  .post(addVegetable)
  .get(getAllVegetableOfStorage);

vegetableRouter
  .route("/:storageId/:vegetableId")
  .get(getSingleVegetableOfStorage)
  .delete(deleteVegetable);

export default vegetableRouter;
