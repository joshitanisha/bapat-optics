const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const AppSetupController = require("../../../../../controllers/api/v1/admin/app_setups/app_setups.controller");
router.get("/", PermissionMiddleware(IDS.permissions.AppSetup.List), AppSetupController.findAll);
router.get("/:id", PermissionMiddleware(IDS.permissions.AppSetup.List), AppSetupController.findOne);
router.put("/:id", PermissionMiddleware(IDS.permissions.AppSetup.Edit), AppSetupController.update);

module.exports = router;