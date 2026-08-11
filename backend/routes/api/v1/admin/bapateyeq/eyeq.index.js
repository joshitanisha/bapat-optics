const express = require("express");
const router = express.Router();
const {
  Validation,
  Validate,
} = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");

// EyeqController Eyeq eyeq

const EyeqController = require("../../../../../controllers/api/v1/admin/bapateyeq/eyeq.controller.js");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.Eyeq.List),
  EyeqController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.Eyeq.List),
  EyeqController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.Eyeq.Add),
  Validation.name,
  Validate,
  EyeqController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.Eyeq.Edit),
  Validation.name,
  Validate,
  EyeqController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.Eyeq.Delete),
  EyeqController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.Eyeq.Edit),
  EyeqController.status
);

module.exports = router;
