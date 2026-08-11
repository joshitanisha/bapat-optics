const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");


// S Category routes

const CouponController = require("../../../../../controllers/api/v1/admin/coupons/coupon.controller");
router.get("/", CouponController.findAll);
router.get("/:id", CouponController.findOne);
router.post("/", Validation.name, Validate, CouponController.create);
router.put("/:id", Validation.name, Validate, CouponController.update);
router.delete("/:id", CouponController.delete);
router.post("/:id", CouponController.status);

router.post("/customer-view/:id", CouponController.CustomerViewStatus);

router.post(
  "/valid",
  Validation.amount,
  Validation.code,
  Validate,
  CouponController.validCouponCode
);
module.exports = router;
