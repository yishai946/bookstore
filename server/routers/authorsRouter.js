import express from "express";
import authorsFunctions from "../functions/authorsFunctions.js";

const router = express.Router();

// add new book
router.post("/add", authorsFunctions.add);

// get all books
router.get("/getAll", authorsFunctions.getAll);

// get book by id
router.get("/get/:id", authorsFunctions.get);

// delete book by id
router.delete("/delete/:id", authorsFunctions.delete);

// update book by id
router.put("/update/:id", authorsFunctions.update);

export default router;
