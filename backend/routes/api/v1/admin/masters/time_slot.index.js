const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const UnitController = require("../../../../../controllers/api/v1/admin/masters/time_slot.controller");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.Unit.List),
  UnitController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.Unit.List),
  UnitController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.Unit.Add),
  // Validation.from,
  Validate,
  UnitController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.Unit.Edit),
  // Validation.from,
  Validate,
  UnitController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.Unit.Delete),
  UnitController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.Unit.Edit),
  UnitController.status
);
module.exports = router;