const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const PaymentTypeController = require("../../../../../controllers/api/v1/admin/masters/payment_type.controller");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.PaymentType.List),
  PaymentTypeController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.PaymentType.List),
  PaymentTypeController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.PaymentType.Add),
  Validation.name,
  Validate,
  PaymentTypeController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.PaymentType.Edit),
  Validation.name,
  Validate,
  PaymentTypeController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.PaymentType.Delete),
  PaymentTypeController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.PaymentType.Edit),
  PaymentTypeController.status
);


module.exports = router;