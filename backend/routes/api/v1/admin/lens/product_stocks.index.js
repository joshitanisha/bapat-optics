const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const OfferedProductController = require("../../../../../controllers/api/v1/admin/products/product_stock/product_stock.controller");

router.get("/", OfferedProductController.findAll);
router.get("/:id", OfferedProductController.findOne);
// router.post("/", Validation.product_id, Validate, OfferedProductController.create);
router.put("/:id", Validate, OfferedProductController.update);
router.delete("/:id", OfferedProductController.delete);
router.post("/:id", OfferedProductController.status);
router.get("/inventory/:id", OfferedProductController.findInventoryAll);

module.exports = router;