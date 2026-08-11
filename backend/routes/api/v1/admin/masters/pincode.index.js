const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const PoincodeController = require("../../../../../controllers/api/v1/admin/masters/pincode.controller");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.Pincode.List),
  PoincodeController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.Pincode.List),
  PoincodeController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.Pincode.Add),
  Validation.name,
  Validation.country_id,
  Validation.state_id,
  Validation.city_id,
  Validate,
  PoincodeController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.Pincode.Edit),
  Validation.name,
  Validation.country_id,
  Validation.state_id,
  Validation.city_id,
  Validate,
  PoincodeController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.Pincode.Delete),
  PoincodeController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.Pincode.Edit),
  PoincodeController.status
);
module.exports = router;