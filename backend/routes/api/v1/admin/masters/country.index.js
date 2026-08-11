const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const CountryController = require("../../../../../controllers/api/v1/admin/masters/country.controller");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.Country.List),
  CountryController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.Country.List),
  CountryController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.Country.Add),
  Validation.name,
  Validate,
  CountryController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.Country.Edit),
  Validation.name,
  Validate,
  CountryController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.Country.Delete),
  CountryController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.Country.Edit),
  CountryController.status
);

module.exports = router;