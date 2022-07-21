const express = require("express");
const router = express.Router();
const authenController = require("../controller/authenController");
const jwt = require("../hooks/jwt");

// Query all users jwt.verify,
router.get("/", authenController.allUser);
router.post("/register", authenController.userRegister);
router.post("/login", authenController.login);
router.get("/getprofile", jwt.verify, authenController.getProfile);
router.put("/editprofile", authenController.editProfile);
router.post("/deleteprofile", authenController.deleteProfile);

// router.post("/createpost",userpostController.userCreatePost);

module.exports = router;
