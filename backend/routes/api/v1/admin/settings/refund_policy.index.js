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

const RefundPolicyController = require("../../../../../controllers/api/v1/admin/masters/refund_policy.js");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.Refund_Policy.List),
  RefundPolicyController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.Refund_Policy.List),
  RefundPolicyController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.Refund_Policy.Add),
  Validation.content,
  Validate,
  RefundPolicyController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.Refund_Policy.Edit),
  Validation.content,
  Validate,
  RefundPolicyController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.Refund_Policy.Delete),
  RefundPolicyController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.Refund_Policy.Edit),
  RefundPolicyController.status
);

module.exports = router;
