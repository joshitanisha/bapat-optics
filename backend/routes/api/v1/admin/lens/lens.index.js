const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const LensController = require("../../../../../controllers/api/v1/admin/lens/lens/lens.controller");

router.get("/search-history", LensController.findAllSearchHistory);
router.get("/", LensController.findAll);
router.post("/download", LensController.getDownloadExcelOrderList);

router.post("/Product-order-download", LensController.getDownloadExcelProductList);
router.get("/:id", LensController.findOne);
router.post("/bulk", LensController.BulkUpload);
router.post("/sample", LensController.Sample);
router.post("/", Validation.name, Validate, LensController.create);
router.put("/:id", Validation.name, Validate, LensController.update);
router.delete("/:id", LensController.delete);
router.post("/top-pick/:id", LensController.topPick);
router.post("/:id", LensController.status);
router.post("/status/:id", LensController.productStatus);
router.post("/link-product/:id", LensController.linkProducts);

router.post("/seasonable-status/:id", LensController.seasonableStatus);

router.post("/popular-status/:id", LensController.PopularStatus);

router.delete("/product-image/:id", LensController.deleteProductImage);
module.exports = router;