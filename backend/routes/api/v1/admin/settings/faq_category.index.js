const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const FaqCategoryController = require("../../../../../controllers/api/v1/admin/masters/faq_category.controller");
router.get("/", PermissionMiddleware(IDS.permissions.FaqCategory.List), Validation.name, FaqCategoryController.findAll);
router.get("/:id", PermissionMiddleware(IDS.permissions.FaqCategory.List), FaqCategoryController.findOne);
router.post("/", PermissionMiddleware(IDS.permissions.FaqCategory.Add), Validation.name, Validate, FaqCategoryController.create);
router.put("/:id", PermissionMiddleware(IDS.permissions.FaqCategory.Edit), Validation.name, Validate, FaqCategoryController.update);
router.delete("/:id", PermissionMiddleware(IDS.permissions.FaqCategory.Delete), FaqCategoryController.delete);
router.post("/:id", PermissionMiddleware(IDS.permissions.FaqCategory.Edit), FaqCategoryController.status);
module.exports = router;