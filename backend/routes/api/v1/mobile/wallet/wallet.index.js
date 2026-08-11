const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const {
  AuthMiddleware,
  AuthMiddlewareCustomer,
} = require("../../../../../middleware/auth.middleware");

const SubscriptionController = require("../../../../../controllers/api/v1/mobile/wallet/wallet.controller");
router.get("/", AuthMiddlewareCustomer, SubscriptionController.findAll);
router.get("/single", AuthMiddlewareCustomer, SubscriptionController.findOne);
// router.get(
//   "/plan/:id",
//   AuthMiddlewareCustomer,
//   SubscriptionController.findOnePlan
// );

router.post(
  "/",
  Validation.transaction_id,
  // Validation.transaction_type_id,
  Validation.amount,
  Validation.description,
  Validate,
  AuthMiddlewareCustomer,
  SubscriptionController.transaction
);

// router.post(
//   "/appointment",
  // Validation.dob,
//   Validation.name,
//   Validation.height,
//   Validation.weight,
//    Validation.doctor_id,
//   //  Validation.appointment_id,
//    Validation.category_id,
//   Validate,
//   AuthMiddlewareCustomer,
//   SubscriptionController.CreatAppointment
// );
// router.get(
//   "/",
//   AuthMiddlewareCustomer,
//   SubscriptionController.GetAllSubscription
// );
module.exports = router;
