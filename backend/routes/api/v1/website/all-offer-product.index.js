const express = require("express");
const router = express.Router();
 //const { Validation, Validate } = require("../../../../../helper/validation/validations");
// const IDS = require("../../../../../helper/fix_ids");
// const {
//   PermissionMiddleware,
// } = require("../../../../../middleware/permission.middleware");


//const OfferedProductController = require("../../../../../controllers/api/v1/admin/products/offered_products/offered_products.controller");

const OfferedProductController = require("../../../../controllers/api/v1/website/product/offer_product.controller")
router.get("/", OfferedProductController.findAll);
router.get("/:id", OfferedProductController.findOne);

module.exports = router;