const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");
const { uploadImage } = require("../middleware/uploadImage.middleware");
const { verifyUser } = require("../middleware/auth.middleware");

router.route("/register").post(uploadImage, authController.registerUser);
router.route("/login").post(authController.loginUser);
router.route("/").get(verifyUser, authController.getAllUsers);

module.exports = router;
