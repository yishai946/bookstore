import bodyParser from "body-parser";
import express from "express";
import booksRouter from "./controller/booksRouter.js";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/api/books", booksRouter);

export default app
