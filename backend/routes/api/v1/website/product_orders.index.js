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

const ProductOrderController = require("../../../../controllers/api/v1/website/orders/product_orders.controller");


router.post(
  "/webhook",
  ProductOrderController.PaymentWebhook,
);
router.get(
  "/cancel-order",
  AuthMiddlewareCustomer,
  ProductOrderController.findAllCancelOrder,
);
router.get("/", AuthMiddlewareCustomer, ProductOrderController.findAll);
router.get("/:id", AuthMiddlewareCustomer, ProductOrderController.findOne);
router.post(
  "/",
  Validation.address_id,
  Validation.payment_method_id,
  Validate,
  AuthMiddlewareCustomer,
  ProductOrderController.CreateOrder,
);

router.post(
  "/payment-online/:id",
  // Validation.payment_method_id,
  Validation.payment_id,
  Validate,
  AuthMiddlewareCustomer,
  ProductOrderController.PaymentAfterOnline,
);



router.post(
  "/calculate",
  // Validation.pack_type_id,
  // Validation.address_id,
  Validate,
  AuthMiddlewareCustomer,
  ProductOrderController.CalculationOrder,
);

router.post(
  "/order-cancel/:id",
  AuthMiddlewareCustomer,
  Validation.cancel_reason_id,
  Validate,
  ProductOrderController.CancelOrder,
);
router.post(
  "/order-return/:id",
  AuthMiddlewareCustomer,
  Validation.return_reason_id,
  Validate,
  ProductOrderController.ReturnRepalceOrder,
);
router.get(
  "/reorder/:id",
  AuthMiddlewareCustomer,
  ProductOrderController.ReOrder,
);

router.get(
  "/cancel/:id",
  AuthMiddlewareCustomer,
  ProductOrderController.findOneCancelOrder,
);

router.get(
  "/return/order",
  AuthMiddlewareCustomer,
  ProductOrderController.findAllReturnOrder,
);

router.get(
  "/return/:id",
  AuthMiddlewareCustomer,
  ProductOrderController.findOneReturnOrder,
);
module.exports = router;
