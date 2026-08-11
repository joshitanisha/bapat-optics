const express = require("express");
const router = express.Router();
const {
  AuthMiddleware,
  AuthMiddlewareCustomer,
} = require("../../../../middleware/auth.middleware");

const PrivacyPolicyController = require("../../../../controllers/api/v1/website/privacy_policy/privacypolicy.controller");

router.get("/all-privacypolicy", PrivacyPolicyController.findAll);

router.get("/all-shpping-policy", PrivacyPolicyController.findAllShippingPolicy);

//router.get("/all-blogsbyid/:id",BlogController.findOne);

module.exports = router;
