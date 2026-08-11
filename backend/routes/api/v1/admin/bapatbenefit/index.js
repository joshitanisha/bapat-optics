const express = require("express");

const router = express.Router();

router.use("/offeredbenefit", require("./offeredbenefit.index.js"));

module.exports = router;
