const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../helper/validation/validations");
const {
  AuthMiddleware,
  AuthMiddlewareCustomer,
} = require("../../../../middleware/auth.middleware");

const WishlistController = require("../../../../controllers/api/v1/website/wishlist/wishlist.controller");
router.get("/", AuthMiddlewareCustomer, WishlistController.findAll);
router.get(
  "/array",
  AuthMiddlewareCustomer,
  WishlistController.WishlistArray
);
router.get(
  "/check/:id",
  AuthMiddlewareCustomer,
  WishlistController.CheckProductInWishlist
);
router.post(
  "/:id",
  AuthMiddlewareCustomer,
  WishlistController.AddOrRemoveWishlist
);
module.exports = router;
