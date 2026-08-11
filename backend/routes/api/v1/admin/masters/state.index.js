const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const StateController = require("../../../../../controllers/api/v1/admin/masters/state.controller");
router.get(
  "/",
  PermissionMiddleware(IDS.permissions.State.List),
  StateController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.State.List),
  StateController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.State.Add),
  Validation.name,
  Validation.country_id,
  Validate,
  StateController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.State.Edit),
  Validation.name,
  Validation.country_id,
  Validate,
  StateController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.State.Delete),
  StateController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.State.Edit),
  StateController.status
);


module.exports = router;