const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");

const AddBannerController = require("../../../../../controllers/api/v1/admin/masters/add_banner.controller");
router.get("/", PermissionMiddleware(IDS.permissions.HomeBanner.List), AddBannerController.findAll);
router.get("/:id", PermissionMiddleware(IDS.permissions.HomeBanner.List), AddBannerController.findOne);
router.post("/", PermissionMiddleware(IDS.permissions.HomeBanner.Add), Validation.name, Validate, AddBannerController.create);
router.put("/:id", PermissionMiddleware(IDS.permissions.HomeBanner.Edit), Validation.name, Validate, AddBannerController.update);
router.delete("/:id", PermissionMiddleware(IDS.permissions.HomeBanner.Delete), AddBannerController.delete);
router.post("/:id", PermissionMiddleware(IDS.permissions.HomeBanner.Edit), AddBannerController.status);

module.exports = router;