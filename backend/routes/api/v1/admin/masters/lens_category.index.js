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

const LensCategoryController = require("../../../../../controllers/api/v1/admin/masters/lens_category.controller");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.LensCategory.List),
  LensCategoryController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.LensCategory.List),
  LensCategoryController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.LensCategory.Add),
  Validation.name,
  Validate,
  LensCategoryController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.LensCategory.Edit),
  Validation.name,
  Validate,
  LensCategoryController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.LensCategory.Delete),
  LensCategoryController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.LensCategory.Edit),
  LensCategoryController.status
);
router.post(
  "/customer/:id",
  PermissionMiddleware(IDS.permissions.LensCategory.Edit),
  LensCategoryController.statusCustomer
);

router.post(
  "/eight-plus-status/:id",
  PermissionMiddleware(IDS.permissions.LensCategory.Edit),
  LensCategoryController.eightPlusstatus
);
module.exports = router;
