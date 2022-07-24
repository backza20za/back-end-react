const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const jwt = require("../hooks/jwt");

// Query all users jwt.verify,
// router.get("/", productController.allEmployees);
// router.get("/:id", productController.getById);
router.post("/", productController.addProduct);
// router.put("/", productController.updateEmployees);
// router.delete("/:id", productController.delEmployees);

module.exports = router;
