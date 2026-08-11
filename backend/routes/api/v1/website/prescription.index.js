const express = require("express");
const router = express.Router();
// const { Validation, Validate } = require("../../../../../helper/validation/validations");
// const IDS = require("../../../../../helper/fix_ids");
// const {
//   PermissionMiddleware,
// } = require("../../../../../middleware/permission.middleware");


const CareerController = require("../../../../controllers/api/v1/website/prescription/prescription.controller");

router.post("/", CareerController.create);

router.get("/static", CareerController.getAllStaticPrescription);

router.get("/single", CareerController.findOne);

router.get("/", CareerController.findAll);


module.exports = router;