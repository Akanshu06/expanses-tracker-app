const express = require("express");
const router = express.Router();
const userController = require("../controllers/passwordcontrol");

router.use("/forgot-password", userController.forgotPassword);
router.get("/reset_password/:id", userController.resetPassword);
router.get("/updatepassword/:id", userController.updatePassword);

module.exports = router;
