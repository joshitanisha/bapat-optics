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

// Face_WidthController Face_Width facewitdh

const Face_WidthController = require("../../../../../controllers/api/v1/admin/masters/facewitdh.controller.js");

router.get(
  "/",
  PermissionMiddleware(IDS.permissions.Face_Width.List),
  Face_WidthController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.Face_Width.List),
  Face_WidthController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.Face_Width.Add),
  Validation.name,
  Validate,
  Face_WidthController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.Face_Width.Edit),
  Validation.name,
  Validate,
  Face_WidthController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.Face_Width.Delete),
  Face_WidthController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.Face_Width.Edit),
  Face_WidthController.status
);

module.exports = router;
