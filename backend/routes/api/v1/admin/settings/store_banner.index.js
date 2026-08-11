const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const HomeBannerController = require("../../../../../controllers/api/v1/admin/masters/store_banner.controller");
router.get("/", PermissionMiddleware(IDS.permissions.HomeBanner.List), HomeBannerController.findAll);
router.get("/:id", PermissionMiddleware(IDS.permissions.HomeBanner.List), HomeBannerController.findOne);
router.post("/", PermissionMiddleware(IDS.permissions.HomeBanner.Add), Validation.name, Validate, HomeBannerController.create);
router.put("/:id", PermissionMiddleware(IDS.permissions.HomeBanner.Edit), Validation.name, Validate, HomeBannerController.update);
router.delete("/:id", PermissionMiddleware(IDS.permissions.HomeBanner.Delete), HomeBannerController.delete);
router.post("/:id", PermissionMiddleware(IDS.permissions.HomeBanner.Edit), HomeBannerController.status);
module.exports = router;