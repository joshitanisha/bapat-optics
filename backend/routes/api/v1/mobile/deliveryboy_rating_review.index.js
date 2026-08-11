const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../helper/validation/validations");
const {
  AuthMiddleware,
  AuthMiddlewareCustomer,
} = require("../../../../middleware/auth.middleware");

const RatingReviewController = require("../../../../controllers/api/v1/mobile/deliveryboy_rating_review/rating_review.controller");
router.post(
  "/",
  AuthMiddlewareCustomer,
  // Validation.product_id,
   Validation.order_id,
  Validation.ratings,
  Validate,
  RatingReviewController.create
);
router.get("/:id", RatingReviewController.getProductRatings);
router.get(
  "/avg/:id",
  RatingReviewController.getProductAvgRatings
);

module.exports = router;
