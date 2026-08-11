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

const ProductController = require("../../../../../controllers/api/v1/admin/products/product/product.controller");
router.put("/multi-status-change", ProductController.MultiStatusChange);
router.get("/search-history", ProductController.findAllSearchHistory);
router.get("/", ProductController.findAll);
router.post("/download", ProductController.getDownloadExcelOrderList);

router.post(
  "/Product-order-download",
  ProductController.getDownloadExcelProductList,
);
router.get("/:id", ProductController.findOne);
router.post("/bulk", ProductController.BulkUpload);

router.post("/zip", ProductController.ZipUpload);
router.post("/sample", ProductController.Sample);
router.post("/", Validation.name, Validate, ProductController.create);
router.put("/:id", Validation.name, Validate, ProductController.update);
router.delete("/:id", ProductController.delete);
router.post("/top-pick/:id", ProductController.topPick);
router.post("/:id", ProductController.status);

router.post("/status/:id", ProductController.productStatus);
router.post("/link-product/:id", ProductController.linkProducts);

router.post("/top-status/:id", ProductController.TopStatus);

router.post("/tranding-status/:id", ProductController.TrandingStatus);

router.post("/barcode-status/:id", ProductController.BarcodeStatus);
router.post("/customer-status/:id", ProductController.CustomerStatus);

router.post("/vto-enable/:id", ProductController.VtoStatus);

router.delete("/product-image/:id", ProductController.deleteProductImage);
module.exports = router;
