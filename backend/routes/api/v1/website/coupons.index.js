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

const CouponController = require("../../../../controllers/api/v1/website/coupons/coupons.controller");
router.get("/", CouponController.findAll);

// router.get("/eligible-coupon",Validation.amount,Validate, CouponController.findAll);
router.get("/:id", CouponController.findOne);

router.post(
  "/valid",
  Validation.amount,
  AuthMiddlewareCustomer,
  Validation.code,
  Validate,
  CouponController.validCouponCode
);
module.exports = router;
