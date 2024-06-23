import express from "express";
import ordersFunctions from "../functions/ordersFunctions.js";

const router = express.Router();

// get all orders
router.get("/getAll", ordersFunctions.getAll);

// get order by id
router.get("/get/:id", ordersFunctions.get);

// get orders between dates
router.get("/getBetweenDates", ordersFunctions.getBetweenDates);

// get all-time highest profit day
router.get("/highestProfitDay", ordersFunctions.getHighestProfitDay);

// get profit between dates
router.get("/profitBetweenDates", ordersFunctions.getTotalProfitBetweenDates);

// get most popular book
router.get("/mostPopularBook", ordersFunctions.getMostPopularBook);

// get most popular author
router.get("/mostPopularAuthor", ordersFunctions.getMostPopularAuthor);

// get most popular genres
router.get("/mostPopularGenres", ordersFunctions.getMostPopularGenres);

// add new order
router.post("/add", ordersFunctions.add);

// delete order by id
router.delete("/delete/:id", ordersFunctions.delete);

export default router;
