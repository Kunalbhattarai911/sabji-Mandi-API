import express, { json } from "express";
import dotenv from "dotenv";
import errorMiddleware from "./src/middleware/errorMiddleware.js";
import pageNotFound from "./src/middleware/pageNotFound.js";
import storageRouter from "./src/route/storage.route.js";
import vegetableRouter from "./src/route/vegetable.route.js";
import userRouter from "./src/route/user.route.js";
import buyVegetableRouter from "./src/route/buyVegetable.route.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 9001;

app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
});

app.use(json());

//storage route
app.use("/api/storage", storageRouter);

//vegetable route
app.use("/api/vegetable", vegetableRouter);

//user Route
app.use("/api/user", userRouter);

//buy vegetable router
app.use("/api/product", buyVegetableRouter);

//page not found
app.use("/*", pageNotFound);

//error middleware
app.use(errorMiddleware);
