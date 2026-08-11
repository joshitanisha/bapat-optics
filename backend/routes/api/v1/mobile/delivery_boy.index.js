const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../helper/validations");
const {
  AuthMiddleware,
  AuthMiddlewareCustomer,
} = require("../../../../middleware/auth.middleware");

const DeliveryBoyController = require("../../../../controllers/api/v1/mobile/delivery_boy/delivery_boy.controller");
router.post(
  "/register",
  Validation.email,
  Validation.name,
  Validation.contact_no,
  Validation.country_id,
  Validation.state_id,
  Validation.city_id,
  Validation.pincode_id,
  Validation.password,
  Validate,
  DeliveryBoyController.Register
);

router.get("/", DeliveryBoyController.getAllDeliveryBoy);
router.get("/:id", DeliveryBoyController.getDeliveryBoy);
module.exports = router;
