const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const RejectReasonsController = require("../../../../../controllers/api/v1/admin/masters/reject_reason.controller");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.RejectReason.List),
  Validation.name,
  RejectReasonsController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.RejectReason.List),
  RejectReasonsController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.RejectReason.Add),
  Validation.name,
  Validate,
  RejectReasonsController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.RejectReason.Edit),
  Validation.name,
  Validate,
  RejectReasonsController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.RejectReason.Delete),
  RejectReasonsController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.RejectReason.Edit),
  RejectReasonsController.status
);

module.exports = router;