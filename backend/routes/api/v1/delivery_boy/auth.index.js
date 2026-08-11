const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../helper/validation/validations");
const {
  AuthMiddleware,
  AuthMiddlewareCustomer,
} = require("../../../../middleware/auth.middleware");

const authController = require("../../../../controllers/api/v1/delivery_boy/auth/auth.controller");
router.post(
  "/check-email-exist",
  Validation.email,
  Validate,
  authController.checkEmailExist
);

router.post(
  "/check-contact-exist",
  Validation.contact_no,
  Validate,
  authController.checkContactExist
);

router.post(
  "/login",
  // Validation.long,
  Validation.device_key,
  // Validation.lat,
  // Validation.address,
  Validation.password,
  Validate,
  authController.Login
);

router.post(
  "/sing-up",
  Validation.name,

  Validation.email,
  Validation.contact_no,
  Validation.password,
  Validation.country_code_id,
  Validation.device_key,
  Validate,
  authController.SignUpUser
);


router.post(
  "/verify-login-contact",
  Validation.contact_no,
  Validation.otp,
  Validate,
  authController.verifyLoginContact
);

router.post(
  "/verify-login-email",
  Validation.email,
  Validation.otp,
  Validate,
  authController.verifyLoginEmail
);

router.post(
  "/update-password-wl",
  Validation.email,
  Validation.password,
  Validate,
  authController.UpdatePasswordWL
);

router.post(
  "/update-bank-details",
  // AuthMiddleware,
  Validation.ifsc,
  Validation.bank_name,
  Validation.account_no,
  Validate,
  authController.createOrupdateKYC
);

router.get("/my-profile", AuthMiddleware, authController.findOne);
router.put(
  "/update-profile",
  Validation.email,
  Validation.name,
  Validation.contact_no,
  Validate,
  AuthMiddleware,
  authController.update
);

module.exports = router;
