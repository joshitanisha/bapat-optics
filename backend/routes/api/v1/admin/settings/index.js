const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const { PermissionMiddleware } = require("../../../../../middleware/permission.middleware");
const IDS = require("../../../../../helper/fix_ids");


// Home Banner Routes

router.use("/home-banner", require("./home_banner.index"));

router.use("/trending-product", require("./tranding_product.index.js"));

router.use("/all-banner", require("./all_banner.index.js"));

// router.use("/store-banner", require("./store_banner.index"));
// Add banner
router.use("/add-banner", require("./add_banner.index"));

// Faq Category routes
router.use("/faq-category", require("./faq_category.index"));

// Faq routes
router.use("/faq", require("./faq.index"));

// About Us routes
router.use("/about-us", require("./about_us.index"));

// Terms and conditions routes
router.use("/terms-and-condition", require("./terms_and_conditions.index"));
// Provacy Policy routes
router.use("/privacy-policy", require("./privacy_policy.index"));

router.use("/refund-policy", require("./refund_policy.index.js"));


router.use("/shipping-policy", require("./shipping_policy.index.js"));



router.use("/help", require("./help.index"));
// Provacy App setups
router.use("/app-setup", require("./app_setups.index"));

// Provacy Social Links
router.use("/social-link", require("./social_links.index"));

module.exports = router;
