const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/sleep", require("./sleep"));
router.use("/users", require("./user"));
router.use("/follows", require("./follow"));

module.exports = router;
