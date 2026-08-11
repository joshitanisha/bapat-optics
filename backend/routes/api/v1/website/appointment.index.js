const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../helper/validation/validations");
// const IDS = require("../../../../../helper/fix_ids");
// const {
//   PermissionMiddleware,
// } = require("../../../../../middleware/permission.middleware");


const appointmentController = require("../../../../controllers/api/v1/website/appointment_form/appointment_form.controller");

router.post("/", Validation.name, Validate, appointmentController.create);

router.get("/", appointmentController.findAll);

router.get("/:id", appointmentController.findOne);

router.put("/:id", appointmentController.update);
router.delete("/:id", appointmentController.delete);






module.exports = router;