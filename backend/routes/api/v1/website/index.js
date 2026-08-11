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

router.use("/user", require("./auth.index"));

router.use("/home", require("./home.index"));

router.use("/about-us", require("./about_us.index.js"));

//user_address
router.use("/user-address", require("./user_address.index"));

//product
router.use("/product", require("./product.index"));

//rating_review
router.use("/rating-review", require("./rating_review.index"));
//cart
router.use("/cart", require("./cart.index"));
//wishlist
router.use("/wishlist", require("./wishlist.index"));

router.use("/product-order", require("./product_orders.index"));

router.use("/coupons", require("./coupons.index"));

router.use("/notification", require("./notification.index"));

router.use("/wallet", require("./wallet/wallet.index"));

router.use("/blog", require("./blog.index"));

router.use("/contact_us", require("./contact_us.index"));

// router.use("/privacy_policy", require("./privacy_policy.index"));

// router.use("/term_and_condition", require("./term_and_condition.index"));

router.use("/offer_product", require("./all-offer-product.index.js"));

router.use("/career-form", require("./career.index.js"));

router.use(
  "/appointment-form",
  // AuthMiddlewareCustomer,
  require("./appointment.index.js")
);

router.use("/bapat-benifits", require("./bapat_benifits.index.js"));

router.use("/bapat-eyeq", require("./bapat_eyeq.index.js"));

router.use(
  "/prescription",
  AuthMiddlewareCustomer,
  require("./prescription.index.js")
);

module.exports = router;
