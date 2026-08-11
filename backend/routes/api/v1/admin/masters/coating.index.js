const express = require("express");
const router = express.Router();
const {
  Validation,
  Validate,
} = require("../../../../../helper/validation/validations.js");
const IDS = require("../../../../../helper/fix_ids.js");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware.js");

// MaterialController Material material

const MaterialController = require("../../../../../controllers/api/v1/admin/masters/coating.controller.js");

router.get(
  "/",
  PermissionMiddleware(IDS.permissions.Material.List),
  MaterialController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.Material.List),
  MaterialController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.Material.Add),
  Validation.name,
  Validate,
  MaterialController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.Material.Edit),
  Validation.name,
  Validate,
  MaterialController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.Material.Delete),
  MaterialController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.Material.Edit),
  MaterialController.status
);

module.exports = router;
