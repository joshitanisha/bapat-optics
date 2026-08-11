const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const {
    PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");
const IDS = require("../../../../../helper/fix_ids");

const appointmentController = require("../../../../../controllers/api/v1/admin/appointment_form/appointment_form.controller");

router.get(
    "/",
    PermissionMiddleware(IDS.permissions.User.List),
    appointmentController.findAll
);
router.get(
    "/:id",
    PermissionMiddleware(IDS.permissions.User.List),
    appointmentController.findOne
);
router.delete(
    "/:id",
    PermissionMiddleware(IDS.permissions.User.Delete),
    appointmentController.delete
);
router.post(
    "/:id",
    PermissionMiddleware(IDS.permissions.User.Edit),
    appointmentController.status
);


router.post(
    "/",
    appointmentController.getDownloadExcelCustomerList
);

module.exports = router;
