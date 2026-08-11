const express = require("express");
const router = express.Router();
const {
  Validation,
  Validate,
} = require("../../../../helper/validation/validations");
const {
  AuthMiddleware,
  AuthMiddlewareCustomer,
} = require("../../../../middleware/auth.middleware");

const EyeqController = require("../../../../controllers/api/v1/website/bapateyeq/eyeq.controller.js");
router.get("/eyeqs", EyeqController.allEye);

module.exports = router;
