const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const VerifyController = require("../../../../../controllers/api/v1/common/verify_otp/verify_otp.controller");

router.post(
  "/send-otp",
  // Validation.contact_no,
  // Validate,
  VerifyController.sendOtp
);

// router.post("/send-vendor-mobile-otp", Validation.contact_no, Validate, VerifyController.sendVendorMobileOtp);

router.post(
  "/verify-otp",
  // Validation.contact_no,
  Validation.otp,
  Validate,
  VerifyController.verifyOtp
);

router.post(
  "/change-password",
  // Validation.contact_no,
  Validation.password,
  Validate,
  VerifyController.UpdatePassword
);



// router.post(
//   "/verify-login",
//   Validation.contact_no,
//   Validation.otp,
//   Validate,
//   VerifyController.verifyLogin
// );

// router.post(
//   "/send-email-otp",
//   Validation.contact_no,
//   VerifyController.sendEmailOtp
// );

// router.post(
//   "/verify-email-otp",
//   Validation.contact_no,
//   Validation.otp,
//   VerifyController.verifyEmailOtp
// );

// router.post(
//   "/check-send-otp",
//   Validation.contact_no,
//   Validation.otp,
//   VerifyController.checkAndSendMobileOtp
// );

// router.post(
//   "/send-vendor-mobile-otp",
//   Validation.contact_no,
//   Validate,
//   VerifyController.sendVendorMobileOtp
// );

// router.post(
//   "/send-delivery-boy-mobile-otp",
//   Validation.contact_no,
//   Validate,
//   VerifyController.sendDeliveryBoyMobileOtp
// );

// router.post(
//   "/send-vendor-email-otp",
//   Validation.email,
//   Validate,
//   VerifyController.sendVendorEmailOtp
// );

// router.post(
//   "/delete-mobile-otp",
//   Validation.contact_no,
//   Validate,
//   VerifyController.deleteMobileOtp
// );

module.exports = router;
