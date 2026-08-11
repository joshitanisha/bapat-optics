const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth/index"));

router.use("/masters", require("./masters/index"));

router.use("/verify-otp", require("./verify_otp/index"));

module.exports = router;
