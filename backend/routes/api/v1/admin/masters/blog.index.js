const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const BlogController = require("../../../../../controllers/api/v1/admin/masters/blog.controller");

router.get(
  "/",
  PermissionMiddleware(IDS.permissions.Brand.List),
  BlogController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.Brand.List),
  BlogController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.Brand.Add),
  Validation.name,
  Validate,
  BlogController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.Brand.Edit),
  Validation.name,
  Validate,
  BlogController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.Brand.Delete),
  BlogController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.Brand.Edit),
  BlogController.status
);

module.exports = router;