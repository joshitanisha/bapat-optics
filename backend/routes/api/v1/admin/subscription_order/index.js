const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
    PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


// Plan routes
router.use("/order", require("./order.index"));




module.exports = router;
