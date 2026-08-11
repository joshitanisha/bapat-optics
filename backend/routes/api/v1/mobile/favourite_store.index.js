const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../helper/validations");
const {
  AuthMiddleware,
  AuthMiddlewareCustomer,
} = require("../../../../middleware/auth.middleware");

const favouriteStoreController = require("../../../../controllers/api/v1/mobile/favourite_store/favourite_store.controller");
router.get(
  "/favourite-store",
  AuthMiddlewareCustomer,
  favouriteStoreController.findAll
);
router.get(
  "/favourite-store-array",
  AuthMiddlewareCustomer,
  favouriteStoreController.favStoreArray
);
router.get(
  "/favourite-store/check/:id",
  AuthMiddlewareCustomer,
  favouriteStoreController.CheckStoreInFavourite
);
router.get(
  "/favourite-store/:id",
  AuthMiddlewareCustomer,
  favouriteStoreController.AddOrRemoveFavourite
);

module.exports = router;
