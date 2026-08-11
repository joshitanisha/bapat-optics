const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const ProvacyPolicyController = require("../../../../../controllers/api/v1/admin/masters/privacy_policy");
router.get("/", PermissionMiddleware(IDS.permissions.PrivacyPolicy.List), ProvacyPolicyController.findAll);
router.get("/:id", PermissionMiddleware(IDS.permissions.PrivacyPolicy.List), ProvacyPolicyController.findOne);
router.post("/", PermissionMiddleware(IDS.permissions.PrivacyPolicy.Add), Validation.content, Validate, ProvacyPolicyController.create);
router.put("/:id", PermissionMiddleware(IDS.permissions.PrivacyPolicy.Edit), Validation.content, Validate, ProvacyPolicyController.update);
router.delete("/:id", PermissionMiddleware(IDS.permissions.PrivacyPolicy.Delete), ProvacyPolicyController.delete);
router.post("/:id", PermissionMiddleware(IDS.permissions.PrivacyPolicy.Edit), ProvacyPolicyController.status);

module.exports = router;