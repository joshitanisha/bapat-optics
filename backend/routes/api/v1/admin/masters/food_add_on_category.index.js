const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const AddOnCategoryController = require("../../../../../controllers/api/v1/admin/masters/food_add_on_category.controller");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.FoodAddOnCategory.List),
  AddOnCategoryController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.FoodAddOnCategory.List),
  AddOnCategoryController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.FoodAddOnCategory.Add),
  Validation.name,
  Validate,
  AddOnCategoryController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.FoodAddOnCategory.Edit),
  Validation.name,
  Validate,
  AddOnCategoryController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.FoodAddOnCategory.Delete),
  AddOnCategoryController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.FoodAddOnCategory.Edit),
  AddOnCategoryController.status
);
module.exports = router;