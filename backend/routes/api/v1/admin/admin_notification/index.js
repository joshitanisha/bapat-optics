const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations.js");
const IDS = require("../../../../../helper/fix_ids.js");

const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware.js");

//CropController crop Crop

const CropController = require("../../../../../controllers/api/v1/admin/admin_notification/admin_notification.controller.js");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.Shape.List),
  CropController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.Shape.List),
  CropController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.Shape.Add),
  // Validation.name,
  Validate,
  CropController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.Shape.Edit),
  // Validation.name,
  Validate,
  CropController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.Shape.Delete),
  CropController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.Shape.Edit),
  CropController.status
);
module.exports = router;