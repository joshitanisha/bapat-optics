const express = require("express");
const router = express.Router();
const {
  AuthMiddleware,
  AuthMiddlewareCustomer,
} = require("../../../../middleware/auth.middleware");

const Term_and_Condition = require("../../../../controllers/api/v1/website/term_and_condition/term_and_condition.controller");

router.get("/term_and_condition", Term_and_Condition.findAll);

//router.get("/all-blogsbyid/:id",BlogController.findOne);

module.exports = router;
