const express = require("express");
const router = express.Router();
const {
  Validation,
  Validate,
} = require("../../../../../helper/validation/validations");
const authController = require("../../../../../controllers/api/v1/common/auth/auth.controller");
const { AuthMiddleware } = require("../../../../../middleware/auth.middleware");

router.post(
  "/admin-login",
  Validation.email,
  Validation.password,
  Validate,
  authController.adminLogin,
);

router.get("/admin-login", AuthMiddleware, authController.adminDetails);

router.get("/usersingleget", AuthMiddleware, authController.getUser);

router.post(
  "/check-exist",
  Validation.email,
  Validate,
  authController.checkExist,
);

router.post(
  "/update-password-wl",
  Validation.password,
  Validate,
  authController.UpdatePasswordWL,
);

router.post(
  "/check-vendor-exist",
  Validation.contact_no,
  Validate,
  authController.checkVendorExist,
);

router.post(
  "/change-password",
  AuthMiddleware,
  authController.postEditPassword,
);
module.exports = router;
