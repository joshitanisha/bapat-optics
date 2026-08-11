const express = require("express");
const router = express.Router();
const {
  Validation,
  Validate,
} = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
  PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");

// OfferController Offer offer

const OfferController = require("../../../../../controllers/api/v1/admin/masters/offer.controller.js");

router.get(
  "/",
  PermissionMiddleware(IDS.permissions.Offer.List),
  OfferController.findAll
);
router.get(
  "/:id",
  PermissionMiddleware(IDS.permissions.Offer.List),
  OfferController.findOne
);
router.post(
  "/",
  PermissionMiddleware(IDS.permissions.Offer.Add),
  Validation.name,
  Validate,
  OfferController.create
);
router.put(
  "/:id",
  PermissionMiddleware(IDS.permissions.Offer.Edit),
  Validation.name,
  Validate,
  OfferController.update
);
router.delete(
  "/:id",
  PermissionMiddleware(IDS.permissions.Offer.Delete),
  OfferController.delete
);
router.post(
  "/:id",
  PermissionMiddleware(IDS.permissions.Offer.Edit),
  OfferController.status
);

module.exports = router;
