const express = require("express");
const router = express.Router();
const {
  AuthMiddleware,
  AuthMiddlewareCustomer,
} = require("../../../../middleware/auth.middleware");

const BlogController = require("../../../../controllers/api/v1/website/blog/blog.controller");

router.get("/", BlogController.findAll);

router.get("/all-blogsbyid/:id",BlogController.findOne);

module.exports = router;
