const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const CountryCodeController = require("../../../../../controllers/api/v1/admin/masters/country_code.controller");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.CountryCode.List),
  CountryCodeController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.CountryCode.List),
  CountryCodeController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.CountryCode.Add),
  // Validation.name,
  Validate,
  CountryCodeController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.CountryCode.Edit),
  // Validation.name,
  Validate,
  CountryCodeController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.CountryCode.Delete),
  CountryCodeController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.CountryCode.Edit),
  CountryCodeController.status
);

module.exports = router;