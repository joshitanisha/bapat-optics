const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations.js");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");

//AreaController Area
const AreaController = require("../../../../../controllers/api/v1/admin/masters/area.controller.js");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.Area.List),
  AreaController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.Area.List),
  AreaController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.Area.Add),
  Validation.name,
  Validation.country_id,
  Validation.state_id,
  Validation.city_id,
    Validation.pincode_id,

  Validate,
  AreaController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.Area.Edit),
  Validation.name,
  Validation.country_id,
  Validation.state_id,
  Validation.city_id,
  Validation.pincode_id,
  Validate,
  AreaController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.Area.Delete),
  AreaController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.Area.Edit),
  AreaController.status
);
module.exports = router;