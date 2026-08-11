const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const GalleryController = require("../../../../../controllers/api/v1/admin/masters/image_gallery.controller");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.GalleryImage.List),
  GalleryController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.GalleryImage.List),
  GalleryController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.GalleryImage.Add),
  Validation.name,
  Validate,
  GalleryController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.GalleryImage.Edit),
  Validation.name,
  Validate,
  GalleryController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.GalleryImage.Delete),
  GalleryController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.GalleryImage.Edit),
  GalleryController.status
);


module.exports = router;