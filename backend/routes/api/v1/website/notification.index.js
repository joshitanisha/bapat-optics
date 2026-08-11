const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../helper/validation/validations");
const {
  AuthMiddleware,
  AuthMiddlewareCustomer,
} = require("../../../../middleware/auth.middleware");

const NotificatoinController = require("../../../../controllers/api/v1/website/notification/notification.controller");
router.get(
  "/",
  AuthMiddlewareCustomer,
  NotificatoinController.GetAllNotifications
);
router.get(
  "/plan",
  AuthMiddlewareCustomer,
  NotificatoinController.GetAllPlanNotifications
);
router.get(
  "/:id",
  AuthMiddlewareCustomer,
  NotificatoinController.findOne
);
module.exports = router;
