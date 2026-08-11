const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../helper/validation/validations");
const {
  AuthMiddleware,
  AuthMiddlewareCustomer,
} = require("../../../../middleware/auth.middleware");

const ProductOrderController = require("../../../../controllers/api/v1/mobile/orders/product_orders.controller");

router.get(
  "/cancel-order",
  AuthMiddlewareCustomer,
  ProductOrderController.findAllCancelOrder
);
router.get(
  "/",
  AuthMiddlewareCustomer,
  ProductOrderController.findAll
);
router.get(
  "/:id",
  AuthMiddlewareCustomer,
  ProductOrderController.findOne
);
router.post(
  "/",
  // Validation.delivery_charges,
  // Validation.time_slot_id,
  // Validation.delivery_date,
  Validation.address_id,
  // Validation.packing_charges,
  // Validation.pack_type_id,
   Validation.tax_type_id,
  Validation.delivery_type_id,
  Validation.payment_method_id,
  Validate,
  AuthMiddlewareCustomer,
  ProductOrderController.CreateOrder
);

router.post(
  "/calculate",
  Validation.pack_type_id,
   Validation.delivery_kilometer,
  Validate,
  AuthMiddlewareCustomer,
  ProductOrderController.CalculationOrder
);


router.post(
  "/product-order-cancel/:id",
  AuthMiddlewareCustomer,
  Validation.cancel_reason_id,
  Validate,
  ProductOrderController.CancelOrder
);
router.post(
  "/product-order-return/:id",
  AuthMiddlewareCustomer,
  Validation.return_reason_id,
  Validate,
  ProductOrderController.ReturnRepalceOrder
);
router.get(
  "/reorder/:id",
  AuthMiddlewareCustomer,
  ProductOrderController.ReOrder
);



router.get(
  "/cancel/:id",
  AuthMiddlewareCustomer,
  ProductOrderController.findOneCancelOrder
);

router.get(
  "/return/order",
  AuthMiddlewareCustomer,
  ProductOrderController.findAllReturnOrder
);

router.get(
  "/return/:id",
  AuthMiddlewareCustomer,
  ProductOrderController.findOneReturnOrder
);
module.exports = router;
