const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { loginValidation } = require("../middlewares/validation");
const { authLimiter } = require("../middlewares/rateLimiter");

router.post("/login", authLimiter, loginValidation, authController.login);

module.exports = router;
