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

const LensTypeController = require("../../../../../controllers/api/v1/admin/masters/lens_type.controller");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.LensType.List),
  LensTypeController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.LensType.List),
  LensTypeController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.LensType.Add),
  Validation.name,
  Validation.item_type_id,
  Validate,
  LensTypeController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.LensType.Edit),
  Validation.name,
  Validation.item_type_id,
  Validate,
  LensTypeController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.LensType.Delete),
  LensTypeController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.LensType.Edit),
  LensTypeController.status
);
router.post(
  "/customer/:id",
  PermissionMiddleware(IDS.permissions.LensType.Edit),
  LensTypeController.statusCustomer
);

router.post(
  "/eight-plus-status/:id",
  PermissionMiddleware(IDS.permissions.LensType.Edit),
  LensTypeController.eightPlusstatus
);
module.exports = router;
