const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");

const CancelReasonsController = require("../../../../../controllers/api/v1/admin/masters/cancel_reason.controller");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.CancelReason.List),
  Validation.name,
  CancelReasonsController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.CancelReason.List),
  CancelReasonsController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.CancelReason.Add),
  Validation.name,
  Validate,
  CancelReasonsController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.CancelReason.Edit),
  Validation.name,
  Validate,
  CancelReasonsController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.CancelReason.Delete),
  CancelReasonsController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.CancelReason.Edit),
  CancelReasonsController.status
);

module.exports = router;