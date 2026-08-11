const express = require("express");

const router = express.Router();

// Review_Reason routes
router.use("/reviewreason", require("./review_reason.index.js"));

// Collection_Center routes
router.use("/collectioncenter", require("./collection_center.index.js"));

// Area routes
router.use("/area", require("./area.index.js"));

router.use("/country", require("./country.index.js"));

//State routes
router.use("/state", require("./state.index.js"));
// City routes
router.use("/city", require("./city.index.js"));
// Pincode routes
router.use("/pincode", require("./pincode.index.js"));

// Brand routes

router.use("/brand", require("./brand.index.js"));
// Product Categories routes
router.use("/p-category", require("./category.index.js"));
// Lens Type routes
router.use("/lens-category", require("./lens_category.index.js"));
// Lens Type routes
router.use("/lens-type", require("./lens_type.index.js"));

// Product Sub Categories routes
router.use("/p-sub-category", require("./subcategory.index.js"));
// Product Child Categories routes

router.use("/p-child-category", require("./childcategory.index.js"));
// Payment Type routes
router.use("/payment-type", require("./payment_type.index.js"));
// Unit routes
router.use("/unit", require("./unit.index.js"));

// Gallery routes
router.use("/gallery-image", require("./gallery.index.js"));
// Add On Category routes
router.use("/food-add-on-category", require("./food_add_on_category.index.js"));

// Add On routes
router.use("/food-add-ons", require("./food_add_on.index.js"));

// Cancel reason

router.use("/cancel-reason", require("./cancel_reason.index.js"));
// Reject Reasons routes
router.use("/reject-reason", require("./reject_reason.index.js"));

// Return Reason routes
router.use("/return-reason", require("./return_reason.index.js"));

// Country Codes routes
router.use("/country-code", require("./country_code.index.js"));

router.use("/time-slot", require("./time_slot.index.js"));

router.use("/plan-feature", require("./plan_feture.index.js"));

// Blog routes
router.use("/blog", require("./blog.index.js"));

// Contact_us routes
router.use("/contact-us", require("./contact_us.index.js"));

router.use("/shape", require("./shape.index.js"));

router.use("/gender", require("./gender.index.js"));

router.use("/material", require("./material.index.js"));
router.use("/coating", require("./coating.index.js"));

router.use("/colour", require("./colour.index.js"));

router.use("/offer", require("./offer.index.js"));

router.use("/facewidth", require("./facewidth.index.js"));

//AppointmentReasons

router.use("/appointment-reason", require("./appointment_reason.index.js"));

router.use("/subscriber", require("./subscriber.index.js"));


router.use("/header-news", require("./header_news.index.js"));


router.use("/prescription-master", require("./prescription_master.js"));
module.exports = router;
