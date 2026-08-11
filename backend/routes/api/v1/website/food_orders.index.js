const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../helper/validations");
const {
  AuthMiddleware,
  AuthMiddlewareCustomer,
} = require("../../../../middleware/auth.middleware");

const FoodOrderController = require("../../../../controllers/api/v1/website/orders/food_orders.controller");
router.get("/", AuthMiddlewareCustomer, FoodOrderController.findAll);
router.get(
  "/food-order/:id",
  AuthMiddlewareCustomer,
  FoodOrderController.findOne
);
router.post(
  "/food-order",
  Validation.payment_mode_id,
  Validation.service_id,
  Validate,
  AuthMiddlewareCustomer,
  FoodOrderController.CreateOrder
);
router.get(
  "/food-order-cancel/:id",
  AuthMiddlewareCustomer,
  FoodOrderController.CancelOrder
);
router.post(
  "/complaint",
  AuthMiddlewareCustomer,
  FoodOrderController.PostComplaintMessage
);
module.exports = router;
