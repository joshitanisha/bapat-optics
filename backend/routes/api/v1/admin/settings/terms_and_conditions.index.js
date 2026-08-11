const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const TermsAndConditionsController = require("../../../../../controllers/api/v1/admin/masters/terms_and_conditions");
router.get("/", PermissionMiddleware(IDS.permissions.TermsAndCondition.List), TermsAndConditionsController.findAll);
router.get("/:id", PermissionMiddleware(IDS.permissions.TermsAndCondition.List), TermsAndConditionsController.findOne);
router.post("/", PermissionMiddleware(IDS.permissions.TermsAndCondition.Add), Validation.content, Validate, TermsAndConditionsController.create);
router.put("/:id", PermissionMiddleware(IDS.permissions.TermsAndCondition.Edit), Validation.content, Validate, TermsAndConditionsController.update);
router.delete("/:id", PermissionMiddleware(IDS.permissions.TermsAndCondition.Delete), TermsAndConditionsController.delete);
router.post("/:id", PermissionMiddleware(IDS.permissions.TermsAndCondition.Edit), TermsAndConditionsController.status);

module.exports = router;