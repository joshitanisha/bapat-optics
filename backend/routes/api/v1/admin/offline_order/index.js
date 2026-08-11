const express = require("express");
const router = express.Router();
const {
  Validation,
  Validate,
} = require("../../../../../helper/validation/validations");

// S Category routes

const OfflineOrderController = require("../../../../../controllers/api/v1/admin/offline_order/user.controller");

router.get("/product-order", OfflineOrderController.findAll);
router.get("/getUser", OfflineOrderController.findUser);

router.post(
  "/registerUser",
  Validation.name,
  Validation.email,
  Validation.contact_no,
  OfflineOrderController.registerUser,
);

router.post("/app-prescription", OfflineOrderController.CreatePrescription);
router.get(
  "/get-prescription/:id",
  OfflineOrderController.GetSinglePrescription,
);

router.get("/cancel-order", OfflineOrderController.findAllCancelOrder);
router.post("/download", OfflineOrderController.getDownloadExcelOrderList);

router.post(
  "/product-order/update-status/:id",
  OfflineOrderController.ChangeOrderStatus,
);

router.post(
  "/product-order/expiry-date/:id",
  OfflineOrderController.ExpiryDate,
);

router.post(
  "/product-order/update-status/:id",
  OfflineOrderController.ChangeOrderStatus,
);

const cancerOrderController = require("../../../../../controllers/api/v1/admin/offline_order/orderCancel.controller");
router.get("/cancel/getUser", cancerOrderController.findUserCancelOrder);
router.get("/getInvoiceNoOrder/:id", cancerOrderController.getInvoiceNoOrder);

router.get("/user-cancel-order/:id", cancerOrderController.getAllUserOrder);

router.post("/cancel-order", Validate, cancerOrderController.CancelOrder);

const returnOrderController = require("../../../../../controllers/api/v1/admin/offline_order/orderReturn.controller");

router.get(
  "/return-getInvoiceNoOrder/:id",
  returnOrderController.getInvoiceNoOrderReturn,
);

router.get("/user-return-order/:id", returnOrderController.getAllUserOrder);
router.post("/return-order", Validate, returnOrderController.ReturnOrder);

const ProductController = require("../../../../../controllers/api/v1/admin/offline_order/product.controller");
router.get("/getBarModProduct", ProductController.findBarModProduct);
router.get("/getBoProduct", ProductController.findBoProduct);

module.exports = router;
