const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
    PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


// Wallet routes
const AlertController = require("../../../../../controllers/api/v1/admin/alert/alert.controller");
router.get("/alert-data", AlertController.getallAlertCounts);

module.exports = router;
