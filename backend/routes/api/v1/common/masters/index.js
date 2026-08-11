const express = require("express");
const router = express.Router();
const {
  Validation,
  Validate,
} = require("../../../../../helper/validation/validations");
const masterController = require("../../../../../controllers/api/v1/common/masters/masters.controller");
const { AuthMiddleware } = require("../../../../../middleware/auth.middleware");

router.get("/all-permissions", masterController.allPermissions);

router.get("/all-roles", masterController.allRoles);

router.post("/country-by-name", masterController.CountryByName);

router.get("/all-country", masterController.allCountry);

router.get("/all-state/:id", masterController.allState);

router.get("/all-state", masterController.allStateWithputId);

router.get("/all-city/:id", masterController.allCity);

router.get("/all-city", masterController.allCityWithOutId);

router.get("/all-pincode/:id", masterController.allPincode);

router.get("/all-area/:id", masterController.allArea);

router.post("/city-by-name", masterController.CityByName);

router.get("/all-gallery-images", masterController.allGalleryImages);

router.get("/all-doctor", masterController.allDoctor);
router.get("/doctor/:id", masterController.allsingleDoctor);
router.get("/all-farmer", masterController.allFarmer);
router.get("/all-customers", masterController.allCustomers);
router.get("/all-delivery-boys", masterController.allDeliveryBoys);
router.get("/all-delivery-type", masterController.allDeliveryType);

router.get("/all-p-category", masterController.allPCategory);
router.get("/all-p-sub-category/:id", masterController.allPSubCategory);
router.get("/all-p-child-category/:id", masterController.allPChildCategory);
router.post("/all-p-sub-categories", masterController.allPSubCategories);
router.get("/all-time-slot", masterController.allTimeSlot);


router.get("/all-lens-type", masterController.allLensType);
router.get("/all-lens-category", masterController.allLensCategory);

router.get("/all-review-reason", masterController.allReviewReason);



router.get("/lens-option/:id", masterController.allLensOption);

router.get("/appointment-reason", masterController.allAppointmentReasons);

router.get(
  "/all-vendor-p-categories",
  AuthMiddleware,
  masterController.allPCategoryVendor
);

router.get("/product", AuthMiddleware, masterController.allProducts);

router.get("/stock-available-product", AuthMiddleware, masterController.allProductsStockAvailble);
router.get("/product/:id", AuthMiddleware, masterController.allsingleProducts);

router.get(
  "/product-varient/:id",
  AuthMiddleware,
  masterController.allProductsVarient
  
);
router.get(
  "/order-product",
  AuthMiddleware,
  masterController.allOrderProducts
);
router.get(
  "/order-product-varient/:id",
  AuthMiddleware,
  masterController.allProductsOrderVarient
);

router.get("/all-units", masterController.allUnits);
router.get("/all-address-type", masterController.allAddressType);
router.get("/all-brands", masterController.allBrands);

router.get("/all-brands-customerview", masterController.allBrandsCustomerView);

router.get("/web-all-brands", masterController.allBrandsWeb);
router.get("/all-payment-methods", masterController.allPaymentMethods);
router.get("/all-order-status", masterController.allOrderStatus);
router.get(
  "/all-count-order-status",
  AuthMiddleware,
  masterController.getallCountsOrderStatus
);

router.get("/all-supplier", masterController.getallsupplier);

router.get("/google-place", masterController.getallGooglePlace);

router.get("/count-delivery-boys", masterController.getallCountsDeliveryBoy);

router.get("/delivery-boys", AuthMiddleware, masterController.allDeliveryBoys);

router.get("/all-cancel-reasons", masterController.allCancelReason);
router.get("/all-return-reasons", masterController.allReturnReason);

router.get("/faq-categories", masterController.allFaqCategories);

router.get("/about-us-content", masterController.getAboutUsContent);
router.get("/term-and-condition-content", masterController.getT_AND_C);
router.get("/privacy-policy-content", masterController.getPrivacyPolicy);
router.get("/help-content", masterController.gethelp);
router.get("/all-faq", masterController.getFaqs);

router.post(
  "/all-products-by-variant",
  masterController.allProductsByVariantIds
);

router.get("/all-stock-types", masterController.allStockTypes);
router.get("/all-pack-types", masterController.allPackTypes);

router.get("/app-setup", masterController.getAppSetup);
// router.get("/social-links", masterController.getSocialLinks);
router.get("/reject-reason", masterController.getRejectReasons);
router.get("/discount-type", masterController.getDiscountType);
router.get("/all-codes", masterController.getCountryCodes);

router.get("/generate-invoice/:id", masterController.generateOrderInvoice);

router.get("/get-city-by-country/:id", masterController.allCityByCountry);

router.get("/allCareer", masterController.allCareer);
router.get("/allShift", masterController.allShift);
router.get("/allJobType", masterController.allJobType);
router.get("/allQualification", masterController.allQualification);
router.get("/allLanguage", masterController.allLanguage);

router.get("/all-shape", masterController.allShape);
router.get("/all-material", masterController.allMaterial);
router.get("/all-face-width", masterController.allFaceWidth);
router.get("/all-frame-type", masterController.allFrameType);
router.get("/all-gender", masterController.allGender);
router.get("/all-color", masterController.allColor);
router.get("/all-offer", masterController.allOffer);

router.get("/all-socialmedia", masterController.allSocialMedia);

router.get("/all-coupon-type", masterController.allCouponType);
router.get("/all-addon", masterController.allAddOn);


router.get("/all-lenase-product/:id", masterController.allLenseProduct);

router.get("/all-stock/:id", masterController.allStock);

router.get("/stock-available-sale/:id", masterController.allStockAvailableSale);

router.get("/ExcelToJson", masterController.ExcelToJson);

router.get("/all-banner-type", masterController.AllBannerType);


router.get("/all-coating", masterController.AllCoating);

router.post("/invoice-genarate", masterController.InvoiceGenerateNormal);
router.post("/return-invoice-genarate", masterController.InvoiceGenerateReturn);
router.post("/cancel-invoice-genarate", masterController.InvoiceGenerateCancel);

router.get("/prescription-value", masterController.PrescriptionValue);


router.get("/all-price-range", masterController.AllPriceRange);

router.get("/all-coupon", masterController.AllCoupon);
module.exports = router;
