const express = require("express");
const router = express.Router();
const employeesController = require("../controller/employeesController");
const jwt = require("../hooks/jwt");

// Query all users jwt.verify,
router.get("/", employeesController.allEmployees);
router.get("/:id", employeesController.getById);
router.post("/", employeesController.addEmployees);
router.put("/", employeesController.updateEmployees);
router.delete("/:id", employeesController.delEmployees);

module.exports = router;
