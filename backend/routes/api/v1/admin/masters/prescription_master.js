const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");
const IDS = require("../../../../../helper/fix_ids");
const {
    PermissionMiddleware,
} = require("../../../../../middleware/permission.middleware");


const AppointmentReasonsController = require("../../../../../controllers/api/v1/admin/masters/prescription_master.controller");
router.get(
    "/",
    Validation.name,
    AppointmentReasonsController.findAll
);
router.get(
    "/:id",
    AppointmentReasonsController.findOne
);
router.post(
    "/",
    PermissionMiddleware(IDS.permissions.RejectReason.Add),
    Validation.name,
  
    Validate,
    AppointmentReasonsController.create
);
router.put(
    "/:id",
    PermissionMiddleware(IDS.permissions.RejectReason.Edit),
    Validation.name,
    Validate,
    AppointmentReasonsController.update
);
router.delete(
    "/:id",
    PermissionMiddleware(IDS.permissions.RejectReason.Delete),
    AppointmentReasonsController.delete
);
router.post(
    "/:id",
    PermissionMiddleware(IDS.permissions.RejectReason.Edit),
    AppointmentReasonsController.status
);

module.exports = router;