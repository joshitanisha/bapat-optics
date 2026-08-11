const express = require("express");
const router = express.Router();
const {
  Validation,
  Validate,
} = require("../../../../helper/validation/validations");
const {
  AuthMiddleware,
  AuthMiddlewareCustomer,
} = require("../../../../middleware/auth.middleware");

const BenifitController = require("../../../../controllers/api/v1/website/bapatbenifit/benifits.controller.js");

router.get("/benifits/offer", BenifitController.allOffer);
router.get("/benifits/:id", BenifitController.allBenifit);




module.exports = router;
