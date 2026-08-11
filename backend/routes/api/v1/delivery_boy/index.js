const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../helper/validation/validations");
const {
  AuthMiddleware,
  AuthMiddlewareCustomer,
} = require("../../../../middleware/auth.middleware");

router.use("/auth", require("./auth.index"));
router.use("/order", require("./order.index"));



module.exports = router;
