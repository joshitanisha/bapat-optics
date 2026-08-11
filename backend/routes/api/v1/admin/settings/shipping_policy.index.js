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

const shippingPolicyController = require("../../../../../controllers/api/v1/admin/masters/shipping_policy.js");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.Shipping_Policy.List),
  shippingPolicyController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.Shipping_Policy.List),
  shippingPolicyController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.Shipping_Policy.Add),
  Validation.content,
  Validate,
  shippingPolicyController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.Shipping_Policy.Edit),
  Validation.content,
  Validate,
  shippingPolicyController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.Shipping_Policy.Delete),
  shippingPolicyController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.Shipping_Policy.Edit),
  shippingPolicyController.status
);

module.exports = router;
