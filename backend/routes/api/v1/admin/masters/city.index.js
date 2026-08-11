const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");

// Country routes
const CityController = require("../../../../../controllers/api/v1/admin/masters/city.controller");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.City.List),
  CityController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.City.List),
  CityController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.City.Add),
  Validation.name,
  Validation.country_id,
  Validation.state_id,
  Validate,
  CityController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.City.Edit),
  Validation.name,
  Validation.country_id,
  Validation.state_id,
  Validate,
  CityController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.City.Delete),
  CityController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.City.Edit),
  CityController.status
);


module.exports = router;