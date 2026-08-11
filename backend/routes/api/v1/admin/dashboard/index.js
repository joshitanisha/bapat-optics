const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
    PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


// Wallet routes
const DashboardController = require("../../../../../controllers/api/v1/admin/dashboard/dashboard.controller");

router.get("/dashboard-data", DashboardController.getallDashboardCounts);
router.get("/sales-chart", DashboardController.getSaleChartData);
router.get("/all-payment-methods", DashboardController.GetAllPaymentMethodAmounts);
router.get("/all-reports", DashboardController.GetAllPaymentReport);

router.get("/doctor-wallet", DashboardController.getallDoctorWallet);

module.exports = router;
