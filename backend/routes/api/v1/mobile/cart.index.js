const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../helper/validation/validations");
const {
  AuthMiddleware,
  AuthMiddlewareCustomer,
} = require("../../../../middleware/auth.middleware");

const CartController = require("../../../../controllers/api/v1/mobile/cart/cart.controller");


router.get("/", AuthMiddlewareCustomer, CartController.findAll);

router.get("/:id", AuthMiddlewareCustomer, CartController.findOne);
router.post("/without-login", CartController.findAllWithoutLogin);

router.post(
  "/add-to-cart",
  AuthMiddlewareCustomer,
  Validation.product_id,
  Validation.variant_id,
  Validate,
  CartController.AddToCart
);

router.post(
  "/quantity",
  AuthMiddlewareCustomer,
  Validation.cart_id,
  Validation.type,
  Validate,
  CartController.cartQuantity
);

router.post("/:id", AuthMiddlewareCustomer, CartController.status);
router.delete("/", AuthMiddlewareCustomer, CartController.deleteAllCart);
router.delete("/:id", AuthMiddlewareCustomer, CartController.delete);
module.exports = router;
