import express from "express";
import booksFunctions from "../functions/booksFunctions.js"

const router = express.Router();

// add new book
router.post("/add", booksFunctions.add);

// get all books
router.get("/getAll", booksFunctions.getAll);

// get book by id
router.get("/get/:id", booksFunctions.get);

export default router;
