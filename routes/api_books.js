const express = require("express");
const router = express.Router();
const booksController = require("../controller/booksController");
const jwt = require("../hooks/jwt");

// Query all users jwt.verify,
router.get("/", booksController.allBooks);
router.get("/:id", booksController.getById);
router.post("/", booksController.addBooks);
router.put("/", booksController.updateBooks);
router.delete("/:id", booksController.delBooks);
// router.post("/createpost",userpostController.userCreatePost); /product/:id"

module.exports = router;
