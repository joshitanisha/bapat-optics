const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations.js");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");

//Collection_CenterController collectioncenter Collection_Center

const Collection_CenterController = require("../../../../../controllers/api/v1/admin/masters/collectioncenter.controller.js");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.Collection_Center.List),
  Collection_CenterController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.Collection_Center.List),
  Collection_CenterController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.Collection_Center.Add),
  Validation.name,
  Validate,
  Collection_CenterController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.Collection_Center.Edit),
  Validation.name,
  Validate,
  Collection_CenterController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.Collection_Center.Delete),
  Collection_CenterController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.Collection_Center.Edit),
  Collection_CenterController.status
);
module.exports = router;