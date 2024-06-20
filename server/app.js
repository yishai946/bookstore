import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import booksRouter from "./routers/booksRouter.js";
import ordersRouter from "./routers/ordersRouter.js";

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/api/books", booksRouter);
app.use("/api/orders", ordersRouter);

export default app
