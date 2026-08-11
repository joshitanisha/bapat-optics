const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
    PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const CareerController = require("../../../../../controllers/api/v1/admin/career/career.controller");

router.get("/", CareerController.findAll);
router.get("/:id", CareerController.findOne);
router.post(
    "/",
    PermissionMiddleware(IDS.permissions.Brand.Add),
    Validation.name,
    Validate,
    CareerController.create
);
router.put(
    "/:id",
    PermissionMiddleware(IDS.permissions.Brand.Edit),
    Validation.name,
    Validate,
    CareerController.update
);
router.delete(
    "/:id",
    PermissionMiddleware(IDS.permissions.Brand.Delete),
    CareerController.delete
);
router.post(
    "/:id",
    PermissionMiddleware(IDS.permissions.Brand.Edit),
    CareerController.status
);

module.exports = router;