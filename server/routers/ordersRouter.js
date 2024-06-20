import express from "express";
import ordersFunctions from "../functions/ordersFunctions.js";

const router = express.Router();

// add new order
router.post("/add", ordersFunctions.add);

// get all orders
router.get("/getAll", ordersFunctions.getAll);

// get order by id
router.get("/get/:id", ordersFunctions.get);

// delete order by id
router.delete("/delete/:id", ordersFunctions.delete);

// update order by id
router.put("/update/:id", ordersFunctions.update);

export default router;
