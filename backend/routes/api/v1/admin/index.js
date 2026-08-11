const express = require("express");
const { AuthMiddleware } = require("../../../../middleware/auth.middleware");
const router = express.Router();

router.use("/masters", AuthMiddleware, require("./masters/index"));

router.use("/bapatbenefit", AuthMiddleware, require("./bapatbenefit/index"));

router.use("/bapateyeq", AuthMiddleware, require("./bapateyeq/index"));

router.use("/setting", AuthMiddleware, require("./settings/index"));

router.use("/customer", AuthMiddleware, require("./customers/index"));

router.use(
  "/employee-management",
  AuthMiddleware,
  require("./employee_management/index"),
);

router.use("/products", AuthMiddleware, require("./products/index"));

router.use("/lens", AuthMiddleware, require("./lens/index"));

router.use("/orders", AuthMiddleware, require("./orders/index"));

router.use("/offline-order", AuthMiddleware, require("./offline_order/index"));

router.use("/coupon", AuthMiddleware, require("./coupon/index"));

router.use("/miscellaneous", AuthMiddleware, require("./miscellaneous/index"));

router.use("/wallet", AuthMiddleware, require("./wallets/index"));

router.use("/delivery-boy", AuthMiddleware, require("./delivery_boy/index"));

router.use("/dashboard", AuthMiddleware, require("./dashboard/index"));

router.use("/alerts", AuthMiddleware, require("./alert/index"));

router.use(
  "/purchase-order",
  AuthMiddleware,
  require("./purchase_order/index"),
);

router.use(
  "/subscription-order",
  AuthMiddleware,
  require("./subscription_order"),
);

router.use(
  "/payment-collection",
  AuthMiddleware,
  require("./payment_collection"),
);
router.use("/notification", AuthMiddleware, require("./notification/index"));

router.use("/career", AuthMiddleware, require("./career"));

router.use("/about-us", AuthMiddleware, require("./about_us/index"));

router.use(
  "/appointment-form",
  AuthMiddleware,
  require("./appointment_form/index"),
);

// router.use(
//   "/category-request",
//   AuthMiddleware,
//   require("./category_request/index")
// );

router.use("/notification", AuthMiddleware, require("./notification/index"));

router.use(
  "/admin-notification",
  AuthMiddleware,
  require("./admin_notification/index"),
);
module.exports = router;
