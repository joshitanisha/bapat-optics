const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../helper/validation/validations");
const {
  AuthMiddleware,
  AuthMiddlewareCustomer,
} = require("../../../../middleware/auth.middleware");

const HomeController = require("../../../../controllers/api/v1/mobile/home/home.controller");
router.get("/banner", HomeController.allHomeBanners);
router.get("/advertisement-banner", HomeController.allAddBanners);

router.get("/store-banner", HomeController.allStoreBanners);
router.post(
  "/help-message",
  AuthMiddlewareCustomer,
  HomeController.PostHelpMessage
);
module.exports = router;
