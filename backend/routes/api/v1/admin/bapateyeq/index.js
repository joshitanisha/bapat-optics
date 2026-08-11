const express = require("express");

const router = express.Router();

router.use("/eyeq", require("./eyeq.index.js"));

module.exports = router;
