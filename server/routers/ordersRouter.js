import express from "express";
import ordersFunctions from "../functions/ordersFunctions.js";

const router = express.Router();

// get all orders
router.get("/getAll", ordersFunctions.getAll);

// get order by id
router.get("/get/:id", ordersFunctions.get);

// get orders between dates
router.get("/getBetweenDates", ordersFunctions.getBetweenDates);

// add new order
router.post("/add", ordersFunctions.add);


// delete order by id
router.delete("/delete/:id", ordersFunctions.delete);

export default router;
