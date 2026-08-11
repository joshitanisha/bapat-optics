const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const PCategoryController = require("../../../../../controllers/api/v1/admin/masters/p_category.controller");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.ProductCategory.List),
  PCategoryController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.ProductCategory.List),
  PCategoryController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.ProductCategory.Add),
  Validation.name,
  // Validation.item_type_id,
  Validate,
  PCategoryController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.ProductCategory.Edit),
  Validation.name,
  // Validation.item_type_id,
  Validate,
  PCategoryController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.ProductCategory.Delete),
  PCategoryController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.ProductCategory.Edit),
  PCategoryController.status
);
router.post(
  "/customer/:id",
  PermissionMiddleware(IDS.permissions.ProductCategory.Edit),
  PCategoryController.statusCustomer
);

router.post(
  "/eight-plus-status/:id",
  PermissionMiddleware(IDS.permissions.ProductCategory.Edit),
  PCategoryController.eightPlusstatus
);
module.exports = router;