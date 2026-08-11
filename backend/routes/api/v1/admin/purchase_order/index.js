const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
    PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


// Plan routes

router.use("/supplier", require("./supplier.index"));

router.use("/purchase-product", require("./purchase_product.index"));

router.use("/receiving-order", require("./receiving_order.index"));

router.use("/supplier-return", require("./supplier_return.index"));


module.exports = router;
