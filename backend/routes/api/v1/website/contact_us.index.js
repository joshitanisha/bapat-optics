const express = require("express");
const router = express.Router();
//const { Validation, Validate } = require("../../../../../helper/validation/validations");
const Contact_usController = require("../../../../controllers/api/v1/website/contact_us/contact_us.controller.js");

// const IDS = require("../../../../../helper/fix_ids");
// const {
//   PermissionMiddleware,
// } = require("../../../../../middleware/permission.middleware");

;
router.post("/", Contact_usController.create);


module.exports = router;