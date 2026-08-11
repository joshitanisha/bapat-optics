const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const AboutUsController = require("../../../../../controllers/api/v1/admin/masters/about_us.controller");
router.get("/", PermissionMiddleware(IDS.permissions.AboutUs.List), AboutUsController.findAll);
router.get("/:id", PermissionMiddleware(IDS.permissions.AboutUs.List), AboutUsController.findOne);
router.post("/", PermissionMiddleware(IDS.permissions.AboutUs.Add), Validation.content, Validate, AboutUsController.create);
router.put("/:id", PermissionMiddleware(IDS.permissions.AboutUs.Edit), Validation.content, Validate, AboutUsController.update);
router.delete("/:id", PermissionMiddleware(IDS.permissions.AboutUs.Delete), AboutUsController.delete);
router.post("/:id", PermissionMiddleware(IDS.permissions.AboutUs.Edit), AboutUsController.status);
module.exports = router;