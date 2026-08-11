const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const {
    PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");
const IDS = require("../../../../../helper/fix_ids");


// Delivery Boy routes
const DeliveryBoyController = require("../../../../../controllers/api/v1/admin/delivery_boy/delivery_boy.controller");
router.get("/rating", PermissionMiddleware(IDS.permissions.User.List), DeliveryBoyController.findAllDeliveryBoyRating);
router.delete("/rating/:id", DeliveryBoyController.deleteDeliveryboyRating);
router.get("/", PermissionMiddleware(IDS.permissions.User.List), DeliveryBoyController.findAll);
router.get("/:id", PermissionMiddleware(IDS.permissions.User.List), DeliveryBoyController.findOne);

router.get("/payment/:id", PermissionMiddleware(IDS.permissions.User.List), DeliveryBoyController.GetAllDeliveryBoyPayment);
router.get("/orders/:id", PermissionMiddleware(IDS.permissions.User.List), DeliveryBoyController.GetAllDeliveryBoysOrders);


router.put("/deliveryboy-payment/:id", PermissionMiddleware(IDS.permissions.User.List), DeliveryBoyController.postDeliveryBoysPayment);
router.get("/paymen-method-order/:id", PermissionMiddleware(IDS.permissions.User.List), DeliveryBoyController.GetAllPaymentMethodAmounts);
router.delete("/:id", PermissionMiddleware(IDS.permissions.User.Delete), DeliveryBoyController.delete);
router.post("/:id", PermissionMiddleware(IDS.permissions.User.Edit), DeliveryBoyController.status);
router.post("/payment-accepted/:id", PermissionMiddleware(IDS.permissions.User.Edit), DeliveryBoyController.PaymentCollect);
router.post("/approval-status/:id", PermissionMiddleware(IDS.permissions.User.Edit), DeliveryBoyController.ApprovalStatus);


module.exports = router;
