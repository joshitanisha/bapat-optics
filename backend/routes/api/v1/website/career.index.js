const express = require("express");
const router = express.Router();
// const { Validation, Validate } = require("../../../../../helper/validation/validations");
// const IDS = require("../../../../../helper/fix_ids");
// const {
//   PermissionMiddleware,
// } = require("../../../../../middleware/permission.middleware");


const CareerController = require("../../../../controllers/api/v1/admin/career/career.controller");

router.post("/", CareerController.create);


module.exports = router;