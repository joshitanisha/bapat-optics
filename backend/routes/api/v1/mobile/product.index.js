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

const ProductController = require("../../../../controllers/api/v1/mobile/product/product.controller");

router.get("/addon-products", ProductController.getAllAddOnProducts);

router.get("/seasonable-products", ProductController.getAllSeasonableProducts);
router.get("/offered-products", ProductController.getAllOfferedProducts);

router.get(
  "/all-product-groupby-category",
  ProductController.allProductsGroupByCategory
);
router.get("/all-products", ProductController.allProducts);
router.get("/:id", ProductController.singleProducts);

router.post(
  "/search-history",
  // AuthMiddlewareCustomer,
  Validation.name,

  Validate,
  ProductController.SearchHistory
);

module.exports = router;
