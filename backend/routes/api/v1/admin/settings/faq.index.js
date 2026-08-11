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

const FaqController = require("../../../../../controllers/api/v1/admin/masters/faq.controller");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.Faq.List),
  FaqController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.Faq.List),
  FaqController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.Faq.Add),
  // Validation.faq_category_id,
  Validation.question,
  Validation.answer,
  Validate,
  FaqController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.Faq.Edit),
  // Validation.faq_category_id,
  Validation.question,
  Validation.answer,
  Validate,
  FaqController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.Faq.Delete),
  FaqController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.Faq.Edit),
  FaqController.status
);
module.exports = router;
