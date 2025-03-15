import { Router } from "express";
import {
  createStorage,
  deleteStorage,
  getAllStorage,
  getAllVegetableOfStorage,
  getStorageById,
  updateStorage,
} from "../controller/storage.controller.js";

const storageRouter = Router();

storageRouter.route("/").post(createStorage).get(getAllStorage);

storageRouter
  .route("/:id")
  .get(getStorageById)
  .patch(updateStorage)
  .delete(deleteStorage);

storageRouter
.route("/:id/vegetable")
.get(getAllVegetableOfStorage);

export default storageRouter;
