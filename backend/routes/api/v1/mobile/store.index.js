const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../helper/validations");
const {
  AuthMiddleware,
  AuthMiddlewareCustomer,
} = require("../../../../middleware/auth.middleware");

const storeController = require("../../../../controllers/api/v1/mobile/store/store.controller");
router.post(
  "/register-store",
  Validation.email,
  Validation.name,
  Validation.contact_no,
  Validation.s_category_id,
  Validation.store_name,
  Validation.country_id,
  Validation.password,
  
  Validate,
  storeController.Register
);

router.get("/all-store", storeController.getAllStore);
router.get("/store/:id", storeController.getStore);
router.get("/offered-products/:id", storeController.getAllOfferedProducts);
module.exports = router;
