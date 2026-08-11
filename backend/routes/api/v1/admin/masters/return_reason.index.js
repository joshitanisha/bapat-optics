const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const ReturnReasonsController = require("../../../../../controllers/api/v1/admin/masters/return_reason.controller");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.ReturnReason.List),
  Validation.name,
  ReturnReasonsController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.ReturnReason.List),
  ReturnReasonsController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.ReturnReason.Add),
  Validation.name,
  Validate,
  ReturnReasonsController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.ReturnReason.Edit),
  Validation.name,
  Validate,
  ReturnReasonsController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.ReturnReason.Delete),
  ReturnReasonsController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.ReturnReason.Edit),
  ReturnReasonsController.status
);

module.exports = router;