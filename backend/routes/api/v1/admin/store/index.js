const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validations");
const {
    PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");
const IDS = require("../../../../../helper/fix_ids");


// S Category routes
const SCategoryController = require("../../../../../controllers/api/v1/admin/store/s_category.controller");
router.get("/s-category", PermissionMiddleware(IDS.permissions.StoreCategory.List), SCategoryController.findAll);
router.get("/s-category/:id", PermissionMiddleware(IDS.permissions.StoreCategory.List), SCategoryController.findOne);
router.post("/s-category", PermissionMiddleware(IDS.permissions.StoreCategory.Add), Validation.name, Validate, SCategoryController.create);
router.put("/s-category/:id", PermissionMiddleware(IDS.permissions.StoreCategory.Edit), Validation.name, Validate, SCategoryController.update);
router.delete("/s-category/:id", PermissionMiddleware(IDS.permissions.StoreCategory.Delete), SCategoryController.delete);
router.post("/s-category/:id", PermissionMiddleware(IDS.permissions.StoreCategory.Edit), SCategoryController.status);
router.post("/s-category/sort-oder/:id", PermissionMiddleware(IDS.permissions.StoreCategory.Edit), SCategoryController.ShortOrder);

// S Category routes
const RCategoryController = require("../../../../../controllers/api/v1/admin/store/restaurant_category");
router.get("/restaurant-category", PermissionMiddleware(IDS.permissions.RestaurantCategory.List), RCategoryController.findAll);
router.get("/restaurant-category/:id", PermissionMiddleware(IDS.permissions.RestaurantCategory.List), RCategoryController.findOne);
router.post("/restaurant-category", PermissionMiddleware(IDS.permissions.RestaurantCategory.Add), Validation.name, Validate, RCategoryController.create);
router.put("/restaurant-category/:id", PermissionMiddleware(IDS.permissions.RestaurantCategory.Edit), Validation.name, Validate, RCategoryController.update);
router.delete("/restaurant-category/:id", PermissionMiddleware(IDS.permissions.RestaurantCategory.Delete), RCategoryController.delete);
router.post("/restaurant-category/:id", PermissionMiddleware(IDS.permissions.RestaurantCategory.Edit), RCategoryController.status);

const MyStoreController = require("../../../../../controllers/api/v1/admin/store/my_store.controller");
router.get("/my-store/my-categories", MyStoreController.getYourCategories);
router.get("/my-store/my-sub-categories", MyStoreController.getYourSubCategories);
router.put("/my-store/update-password", Validation.password, Validate, MyStoreController.updatePassword);
router.post("/my-store/delivery-range", Validation.delivery_range, Validate, MyStoreController.setDeliveryRange);
router.get("/my-store", MyStoreController.findOne);
router.put("/my-store", MyStoreController.update);

// router.post("/:id", MyStoreController.status);
// router.post("/store_status/:id", MyStoreController.storeStatus);

const StoreController = require("../../../../../controllers/api/v1/admin/store/store.controller");
router.get("/", PermissionMiddleware(IDS.permissions.User.List), StoreController.findAll);
router.get("/:id", PermissionMiddleware(IDS.permissions.User.List), StoreController.findOne);
// router.post("/", Validation.name, Validation.s_category_id, Validation.s_sub_category_id, Validate, StoreController.create);
// router.put("/:id", Validation.name, Validation.s_category_id, Validation.s_sub_category_id, Validate, StoreController.update);
router.delete("/:id", PermissionMiddleware(IDS.permissions.User.Delete), StoreController.delete);
router.post("/:id", PermissionMiddleware(IDS.permissions.User.Edit), StoreController.status);
router.post("/store_status/:id", PermissionMiddleware(IDS.permissions.User.Edit), StoreController.storeStatus);
router.post("/category-status/:id", PermissionMiddleware(IDS.permissions.User.Edit), StoreController.CategoryAccept);
router.post("/sub-category-status/:id", PermissionMiddleware(IDS.permissions.User.Edit), StoreController.SubCategoryAccept);
router.post("/asign-delivery-boys/:id", PermissionMiddleware(IDS.permissions.User.Edit), StoreController.AssignDeliveryBoys);

module.exports = router;
