const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const AddOnController = require("../../../../../controllers/api/v1/admin/masters/food_add_on.controller");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.FoodAddOn.List),
  Validation.name,
  AddOnController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.FoodAddOn.List),
  AddOnController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.FoodAddOn.Add),
  Validation.name,
  Validation.add_on_category_id,
  Validate,
  AddOnController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.FoodAddOn.Edit),
  Validation.name,
  Validation.add_on_category_id,
  Validate,
  AddOnController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.FoodAddOn.Delete),
  AddOnController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.FoodAddOn.Edit),
  AddOnController.status
);

module.exports = router;