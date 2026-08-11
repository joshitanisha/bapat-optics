const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const BrandController = require("../../../../../controllers/api/v1/admin/masters/brand.controller");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.Brand.List),
  BrandController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.Brand.List),
  BrandController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.Brand.Add),
  Validation.name,
  Validate,
  BrandController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.Brand.Edit),
  Validation.name,
  Validate,
  BrandController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.Brand.Delete),
  BrandController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.Brand.Edit),
  BrandController.status
);


router.post(
  "/customer/:id",
  PermissionMiddleware(IDS.permissions.ProductCategory.Edit),
  BrandController.statusCustomer
);
module.exports = router;