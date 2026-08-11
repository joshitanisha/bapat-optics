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

// OfferedProductController Offered_Product offeredproduct

const OfferedProductController = require("../../../../../controllers/api/v1/admin/bapatbenefit/offeredproduct.controller.js");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.Offered_Product.List),
  OfferedProductController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.Offered_Product.List),
  OfferedProductController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.Offered_Product.Add),
  Validation.name,
  Validate,
  OfferedProductController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.Offered_Product.Edit),
  Validation.name,
  Validate,
  OfferedProductController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.Offered_Product.Delete),
  OfferedProductController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.Offered_Product.Edit),
  OfferedProductController.status
);

module.exports = router;
