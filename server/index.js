import express from "express";
import dotenv from "dotenv";
import router from "./controller/actions.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use("/", router);

app.listen(port, () => {
  console.log("Server is running on http://localhost:3000");
});
