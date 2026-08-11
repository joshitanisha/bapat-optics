const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../helper/validation/validations");
const {
  AuthMiddleware,
  AuthMiddlewareCustomer,
} = require("../../../../middleware/auth.middleware");

const userAddressController = require("../../../../controllers/api/v1/mobile/user_address/user_address.controller");
router.get(
  "/",
  AuthMiddlewareCustomer,
  userAddressController.findAll
);
router.get(
  "/:id",
  AuthMiddlewareCustomer,
  userAddressController.findOne
);
router.post(
  "/",
  AuthMiddlewareCustomer,
  // Validation.first_name,
  // Validation.building,
  Validation.contact_no,
  Validation.address_type_id,
  Validate,
  userAddressController.create
);
router.put(
  "/:id",
  AuthMiddlewareCustomer,
  // Validation.first_name,
  // Validation.last_name,
  Validation.contact_no,
  Validation.address_type_id,
  Validate,
  userAddressController.update
);
router.delete(
  "/:id",
  AuthMiddlewareCustomer,
  userAddressController.delete
);
router.post(
  "/:id",
  AuthMiddlewareCustomer,
  userAddressController.status
);

module.exports = router;
