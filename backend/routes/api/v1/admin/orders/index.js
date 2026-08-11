const express = require("express");
const router = express.Router();
const {
  Validation,
  Validate,
} = require("../../../../../helper/validation/validations");

// S Category routes

const ProductOrderController = require("../../../../../controllers/api/v1/admin/orders/product_order.controller");

router.get("/product-order", ProductOrderController.findAll);
router.post(
  "/calculate",
  Validate,
  ProductOrderController.CalculationOrder
);
router.post("/", Validate, ProductOrderController.CreateOrder);

router.get("/cancel-order", ProductOrderController.findAllCancelOrder);

router.get("/return-order", ProductOrderController.findAllReturnOrder);

router.post("/download", ProductOrderController.getDownloadExcelOrderList);

router.post(
  "/product-order/update-status/:id",
  ProductOrderController.ChangeOrderStatus
);

router.post(
  "/stoct/assign/:id",
  ProductOrderController.StockAssingOrder
);


router.get(
  "/prescription/:id",
  ProductOrderController.FindOnePrescription
);
router.post(
  "/product-order/update-status/:id",
  ProductOrderController.ChangeOrderStatus
);

const RefundOrderController = require("../../../../../controllers/api/v1/admin/orders/refund_orders.controller");
router.get("/refund-order", RefundOrderController.findAll);
router.post(
  "/accept-refund-order/:id",
  RefundOrderController.AcceptOrRejectOrder
);

const Replace_OrderController = require("../../../../../controllers/api/v1/admin/orders/replace_orders.controller");
router.get("/replace-order", Replace_OrderController.findAll);
router.post(
  "/replace-assign-boy/:id",
  Replace_OrderController.AssignDeliveryBoy
);

const ReturnOrderController = require("../../../../../controllers/api/v1/admin/orders/return_orders.controller");
router.get("/return-order", ReturnOrderController.findAll);

module.exports = router;
