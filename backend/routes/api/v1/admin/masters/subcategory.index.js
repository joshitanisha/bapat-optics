const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const PSubCategoryController = require("../../../../../controllers/api/v1/admin/masters/p_sub_category.controller");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.ProductSubCategory.List),
  PSubCategoryController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.ProductSubCategory.List),
  PSubCategoryController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.ProductSubCategory.Add),
  Validation.name,
  Validation.p_category_id,
  Validate,
  PSubCategoryController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.ProductSubCategory.Edit),
  Validation.name,
  Validation.p_category_id,
  Validate,
  PSubCategoryController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.ProductSubCategory.Delete),
  PSubCategoryController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.ProductSubCategory.Edit),
  PSubCategoryController.status
);


module.exports = router;