const express = require("express");
const router = express.Router();
const {
  Validation,
  Validate,
} = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");

const PlanController = require("../../../../../controllers/api/v1/admin/purchase_order/supplier_return/supplier_return.controller");
router.get("/", PlanController.findAll);
router.get("/:id", PlanController.findOne);

router.post("/", PlanController.create);
router.put("/:id", Validate, PlanController.update);
router.delete("/:id", PlanController.delete);
router.post("/replace-status/:id", PlanController.ReplaceStatus);
router.post("/download", PlanController.getDownloadExcelOrderList);
module.exports = router;
