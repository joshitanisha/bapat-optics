const express = require("express");
const router = express.Router();
const {
  Validation,
  Validate,
} = require("../../../../../helper/validation/validations.js");

// S Category routes

router.use("/addon", require("./add_on.index.js"));
router.use("/product-stock", require("./product_stocks.index.js"));

router.use("/waste-product", require("./product_stocks.index.js"));

router.use("/rating", require("./rating_reviews.index.js"));
router.use("/offered-product", require("./offered_products.index.js"));

router.use("/", require("./product.index.js"));


module.exports = router;
