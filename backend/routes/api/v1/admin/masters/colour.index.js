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

// ColourController Colour colour

const ColourController = require("../../../../../controllers/api/v1/admin/masters/colour.controller.js");

router.get(
  "/",
  PermissionMiddleware(IDS.permissions.Colour.List),
  ColourController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.Colour.List),
  ColourController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.Colour.Add),
  Validation.name,
  Validate,
  ColourController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.Colour.Edit),
  Validation.name,
  Validate,
  ColourController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.Colour.Delete),
  ColourController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.Colour.Edit),
  ColourController.status
);

module.exports = router;
