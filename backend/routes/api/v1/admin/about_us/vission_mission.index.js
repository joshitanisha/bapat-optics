const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
    PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const QualificationController = require("../../../../../controllers/api/v1/admin/about_us/vission_mission.controller");

router.get("/", QualificationController.findAll);
router.get("/:id", QualificationController.findOne);
router.post(
    "/",
    PermissionMiddleware(IDS.permissions.Brand.Add),
    Validation.name,
    Validate,
    QualificationController.create
);
router.put(
    "/:id",
    PermissionMiddleware(IDS.permissions.Brand.Edit),
    Validation.name,
    Validate,
    QualificationController.update
);
router.delete(
    "/:id",
    PermissionMiddleware(IDS.permissions.Brand.Delete),
    QualificationController.delete
);
router.post(
    "/:id",
    PermissionMiddleware(IDS.permissions.Brand.Edit),
    QualificationController.status
);

module.exports = router;