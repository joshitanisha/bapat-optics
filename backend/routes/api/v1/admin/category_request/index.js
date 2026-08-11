const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validations");
const {
    PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");
const IDS = require("../../../../../helper/fix_ids");


// S Category routes
const CategoryRequestController = require("../../../../../controllers/api/v1/admin/category_request/p_category_request.controller");
router.get("/category-request", CategoryRequestController.findAll);
router.delete("/category-request/:id", CategoryRequestController.delete);
router.get("/accept-category-request/:id", CategoryRequestController.CategoryAccept);
// router.get("/accept-sub-category-request/:id", CategoryRequestController.SubCategoryAccept);

// S Category routes
const SubCategoryRequestController = require("../../../../../controllers/api/v1/admin/category_request/p_sub_category_request.controller");
router.get("/sub-category-request", SubCategoryRequestController.findAll);
router.delete("/sub-category-request/:id", SubCategoryRequestController.delete);
router.get("/accept-sub-category-request/:id", SubCategoryRequestController.SubCategoryAccept);


module.exports = router;
