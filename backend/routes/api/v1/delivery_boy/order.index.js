const express = require("express");
const router = express.Router();
const { Validation, Validate, validateDeliveryData } = require("../../../../helper/validation/validations");
const {
  AuthMiddleware,
  AuthMiddlewareCustomer,
} = require("../../../../middleware/auth.middleware");

const OrdersController = require("../../../../controllers/api/v1/delivery_boy/OrderDetails/orders.controller");
const { validate } = require("node-cron");


router.get(
  "/deliveryboy-payment",
  AuthMiddleware,
  OrdersController.DeliverBoyPayment
);
router.get(
  "/all-count-orders",
  AuthMiddleware,
  OrdersController.GetAllDashboard
);

router.get(
  "/all-payment-report",
  AuthMiddleware,
  OrdersController.GetAllTotal
);

router.get("/payment-amount", AuthMiddleware, OrdersController.GetTotalAmounts);
router.get(
  "/all-orders",
  AuthMiddleware,
  OrdersController.GetAllDeliveryBoysOrders
);

router.get(
  "/all-Return/order",
  AuthMiddleware,
  OrdersController.GetAllDeliveryBoysReturnOrders
);

router.get(
  "/:id",
  AuthMiddleware,
  OrdersController.GetSingleOrder
);

router.get(
  "/return/single/:id",
  AuthMiddleware,
  OrdersController.SingleReturnOrder
);
router.get("/accept-order/:id", AuthMiddleware, OrdersController.AcceptOrder);
router.get("/pick-order/:id", AuthMiddleware, OrdersController.PickOrder);


router.post(
  "/deliver-order/:id",
  // validateDeliveryData,
   Validate,
  AuthMiddleware,
  
  OrdersController.DeliverOrder
);
router.post("/reject-order/:id", AuthMiddleware, OrdersController.RejectOrder);

// router.post("/reject-order/:id", AuthMiddleware, OrdersController.RejectOrder);

// Return Orders
router.get(
  "/return-accept-order/:id",
  AuthMiddleware,
  OrdersController.AcceptReturnOrder
);

router.get(
  "/return-pick-order/:id",
  AuthMiddleware,
  OrdersController.PickReturnOrder
);

router.get(
  "/return-deliver-order/:id",
  AuthMiddleware,
  OrdersController.DeliverReturnOrder
);



router.get(
  "/return-rejected-order/:id",
  AuthMiddleware,
  OrdersController.RejectedReturnOrder
);

// Replace Orders
// router.get(
//   "/replace-accept-order/:id",
//   AuthMiddleware,
//   OrdersController.AcceptReplaceOrder
// );

// router.get(
//   "/replace-store-itme-pickup-scheduled-order/:id",
//   AuthMiddleware,
//   OrdersController.StoreItmePickupScheduledReplaceOrder
// );

// router.get(
//   "/replace-store-item-picked-order/:id",
//   AuthMiddleware,
//   OrdersController.StoreItemPickedOrder
// );

// router.get(
//   "/replace-customer-item-replaced-order/:id",
//   AuthMiddleware,
//   OrdersController.CustomerItemReplacedOrder
// );

// router.get(
//   "/replace-item-rejected-order/:id",
//   AuthMiddleware,
//   OrdersController.ReplaceItemRejectedReplaceOrder
// );

// router.get(
//   "/all-return-orders",
//   AuthMiddleware,
//   OrdersController.GetAllDeliveryBoysReturnOrders
// );
// router.get(
//   "/pick-return-order/:id",
//   AuthMiddleware,
//   OrdersController.PickReturnOrder
// );
// router.get(
//   "/deliver-return-order/:id",
//   AuthMiddleware,
//   OrdersController.DeliverReturnOrder
// );

// router.get(
//   "/all-count-orders",
//   AuthMiddleware,
//   OrdersController.GetAllDeliveryBoysOrdersCounts
// );







module.exports = router;
