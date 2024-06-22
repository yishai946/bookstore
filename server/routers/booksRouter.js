import express from "express";
import booksFunctions from "../functions/booksFunctions.js"

const router = express.Router();

// add new book
router.post("/add", booksFunctions.add);

// get all books
router.get("/getAll", booksFunctions.getAll);

// get book by id
router.get("/get/:id", booksFunctions.get);

// get books by genre
router.get("/getByGenre/:genre", booksFunctions.getByGenre);

// delete book by id
router.delete("/delete/:id", booksFunctions.delete);

// update book by id
router.put("/update/:id", booksFunctions.update);


export default router;
