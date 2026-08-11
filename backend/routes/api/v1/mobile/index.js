const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../helper/validation/validations");
const {
  AuthMiddleware,
  AuthMiddlewareCustomer,
} = require("../../../../middleware/auth.middleware");


router.use("/user", require("./auth.index"));

router.use("/home", require("./home.index"));

//store
// router.use("/store", require("./store.index"));

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

//favourite_store
// router.use("/favourite-store", require("./favourite_store.index"));

//product_orders
router.use("/product-order", require("./product_orders.index"));
//food_orders
// router.use("/food-order", require("./food_orders.index"));
//coupons
router.use("/coupons", require("./coupons.index"));

//delivery_boy
// router.use("/delivery-boy", require("./delivery_boy.index"));
//notification

router.use("/notification", require("./notification.index"));

router.use("/wallet", require("./wallet/wallet.index"));

router.use("/delivery-boy-rating", require("./deliveryboy_rating_review.index"));
module.exports = router;
