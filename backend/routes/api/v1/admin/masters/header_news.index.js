const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations.js");
const IDS = require("../../../../../helper/fix_ids.js");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware.js");

//Review_ReasonController reviewreason Review_Reason

const Review_ReasonController = require("../../../../../controllers/api/v1/admin/masters/header_news.controller.js");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.Review_Reason.List),
  Review_ReasonController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.Review_Reason.List),
  Review_ReasonController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.Review_Reason.Add),
  Validation.name,
  Validate,
  Review_ReasonController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.Review_Reason.Edit),
  Validation.name,
  Validate,
  Review_ReasonController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.Review_Reason.Delete),
  Review_ReasonController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.Review_Reason.Edit),
  Review_ReasonController.status
);
module.exports = router;