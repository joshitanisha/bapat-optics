const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const RatingController = require("../../../../../controllers/api/v1/admin/products/rating_reviews/rating_reviews.controller");
router.get("/", RatingController.findAll);
router.get("/:id", RatingController.findOne);
router.delete("/:id", RatingController.delete);
router.post("/:id", RatingController.status);
module.exports = router;