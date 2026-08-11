const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../helper/validation/validations");
const {
  AuthMiddleware,
  AuthMiddlewareCustomer,
} = require("../../../../middleware/auth.middleware");

const HomeController = require("../../../../controllers/api/v1/website/about_us/about_us.controller");
router.get("/vission-mission", HomeController.allVissionMission);

router.get("/our-team", HomeController.allOurTeam);

router.get("/", HomeController.allAboutUs);

router.get("/counter", HomeController.allCounter);

module.exports = router;
