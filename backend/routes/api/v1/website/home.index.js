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

const HomeController = require("../../../../controllers/api/v1/website/home/home.controller");
router.get("/banner", HomeController.allHomeBanners);


router.get("/all-header-news", HomeController.allHeaderNews);

router.get("/trending-product", HomeController.allTrandingProduct);

router.get("/all-banner/:id", HomeController.allBanners);

router.get("/advertisement-banner", HomeController.allAddBanners);

// router.get("/store-banner", HomeController.allStoreBanners);

router.get("/all-termsandconditions", HomeController.allTermsandConditions);

router.get("/all-privacypolicy", HomeController.allPrivacyPolicy);

router.get("/all-shippingpolicy", HomeController.findAllShippingPolicy);

router.get("/all-returnpolicy", HomeController.allRefundPolicy);

router.post(
  "/help-message",
  AuthMiddlewareCustomer,
  HomeController.PostHelpMessage
);

router.get("/all-careers", HomeController.allCareers);

router.post("/all-careers", HomeController.postCareer);

router.get("/all-career/:id", HomeController.getCareer);

router.get(
  "/notifications",
  AuthMiddlewareCustomer,
  HomeController.allNotifications
);

router.post(
  "/notification-status/:id",
  AuthMiddlewareCustomer,
  HomeController.NotificationStatus
);

router.post("/all-Subscriber", HomeController.postSubscriber);


router.post("/product-search", HomeController.postProductSearch);

module.exports = router;
