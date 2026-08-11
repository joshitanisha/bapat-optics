const express = require("express");
const router = express.Router();

const Base = require("../helper/exception_handling");
const { HTTPS } = require("../helper/https-status-codes/https-status-codes");

router.use("/api", require("./api/index"));

router.use("*", async (req, res) => {
  return Base.sendError(res, HTTPS.NOT_FOUND);
});

module.exports = router;
