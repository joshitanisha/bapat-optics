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

const ProductController = require("../../../../controllers/api/v1/website/product/product.controller");
// router.get("/offered-products", ProductController.getAllOfferedProducts);
router.get("/addon-products", ProductController.getAllAddOnProducts);

router.get("/top-products", ProductController.getAllTopProducts);

router.get("/eyeglasses-products", ProductController.getAllEyeglassesProducts);

router.get("/tranding-products", ProductController.getAllTrandingProducts);

router.get(
  "/all-product-groupby-category",
  ProductController.allProductsGroupByCategory,
);

router.get("/all-products", ProductController.allProducts);
router.get("/product-suggestions",  ProductController.getSuggestions);

router.get("/:id", ProductController.singleProducts);

router.post(
  "/search-history",

  Validation.name,

  Validate,
  ProductController.SearchHistory,
);

router.post(
  "/whatapp-send",
  // Validation.product_id,
  // Validate,
  AuthMiddlewareCustomer,
  ProductController.SendWhatapp,
);

router.post(
  "/incontact-whatapp-send",
  // Validation.product_id,
  // Validate,
  AuthMiddlewareCustomer,
  ProductController.SendWhatappContactUs,
);



module.exports = router;
