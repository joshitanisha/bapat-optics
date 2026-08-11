const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations.js");
const IDS = require("../../../../../helper/fix_ids.js");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware.js");

// ShapeController Shape shape

const ShapeController = require("../../../../../controllers/api/v1/admin/masters/gender.controller.js");

router.get(
  "/",
  PermissionMiddleware(IDS.permissions.Shape.List),
  ShapeController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.Shape.List),
  ShapeController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.Shape.Add),
  Validation.name,
  Validate,
  ShapeController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.Shape.Edit),
  Validation.name,
  Validate,
  ShapeController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.Shape.Delete),
  ShapeController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.Shape.Edit),
  ShapeController.status
);

module.exports = router;