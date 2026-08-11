const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const Contact_usController = require("../../../../../controllers/api/v1/admin/masters/contact_us.controller");

router.get("/",Contact_usController.findAll);
router.get("/:id",Contact_usController.findOne);
router.post(
  "/contact-us",
  PermissionMiddleware(IDS.permissions.Brand.Add),
  Validation.name,
  Validate,
  Contact_usController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.Brand.Edit),
  Validation.name,
  Validate,
  Contact_usController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.Brand.Delete),
  Contact_usController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.Brand.Edit),
  Contact_usController.status
);

module.exports = router;