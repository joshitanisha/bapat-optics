const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../helper/validation/validations");
const {
  AuthMiddleware,
  AuthMiddlewareCustomer,
} = require("../../../../middleware/auth.middleware");

const userController = require("../../../../controllers/api/v1/website/user/user.controller");
router.post(
  "/sing-up",
  Validation.name,
  // Validation.last_name,
  Validation.email,
  Validation.contact_no,
  Validation.password,
  // Validation.country_code_id,
  // Validation.device_key,
  Validate,
  userController.SignUpUser
);

router.post(
  "/login",
  Validation.password,
  // Validation.device_key,
  Validate,
  userController.LoginUser
);

router.get("/get-user", AuthMiddlewareCustomer, userController.getUser);

router.put(
  "/update-profile",
  AuthMiddlewareCustomer,
  Validation.name,
  // Validation.last_name,
  Validation.email,
  Validation.contact_no,
  // Validation.password,
  // Validation.country_code_id,
  // Validation.device_key,
  Validate,
  userController.updateProfile
);
router.post(
  "/delete-account",
  AuthMiddlewareCustomer,
  userController.deleteAccount
);
router.post(
  "/verify-delete",
  AuthMiddlewareCustomer,
  Validation.otp,
  Validate,
  userController.verifyDeleteAccount
);

router.post(
  "/change-password",
  AuthMiddlewareCustomer,
  Validation.password,
  Validation.old_password,
  Validate,
  userController.ChangePassword
);

router.put(
  "/delete-contact/:id",
  AuthMiddlewareCustomer,
  userController.updateNumber
);


module.exports = router;
