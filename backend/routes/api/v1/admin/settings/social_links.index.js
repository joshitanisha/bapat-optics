const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");



const SocialLinkController = require("../../../../../controllers/api/v1/admin/app_setups/social_links.controller");
router.get("/", PermissionMiddleware(IDS.permissions.SocialLink.List), SocialLinkController.findAll);
router.get("/:id", PermissionMiddleware(IDS.permissions.SocialLink.List), SocialLinkController.findOne);
router.post("/", PermissionMiddleware(IDS.permissions.SocialLink.Add), SocialLinkController.create);
router.put("/:id", PermissionMiddleware(IDS.permissions.SocialLink.Edit), SocialLinkController.update);
router.delete("/:id", PermissionMiddleware(IDS.permissions.SocialLink.Delete), SocialLinkController.delete);
router.post("/:id", PermissionMiddleware(IDS.permissions.SocialLink.Edit), SocialLinkController.status);
module.exports = router;