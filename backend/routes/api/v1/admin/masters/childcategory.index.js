const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const PChildController = require("../../../../../controllers/api/v1/admin/masters/p_child_category.controller");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.ProductChildCategory.List),
  PChildController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.ProductChildCategory.List),
  PChildController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.ProductChildCategory.List),
  Validation.name,
  Validation.p_category_id,
  Validation.p_sub_category_id,
  Validate,
  PChildController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.ProductChildCategory.List),
  Validation.name,
  Validation.p_category_id,
  Validation.p_sub_category_id,
  Validate,
  PChildController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.ProductChildCategory.List),
  PChildController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.ProductChildCategory.List),
  PChildController.status
);


module.exports = router;