const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations.js");


// S Category routes
router.use("/", require("./lens.index.js"));



//product



module.exports = router;
