const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");


// S Category routes

const miscellaneousReasonController = require("../../../../../controllers/api/v1/admin/miscellaneous/miscellaneous_reason.controller");
router.get("/reasons", miscellaneousReasonController.findAll);
router.get("/reasons/:id", miscellaneousReasonController.findOne);
router.post("/reasons", Validation.name, Validate, miscellaneousReasonController.create);
router.put("/reasons/:id", Validation.name, Validate, miscellaneousReasonController.update);
router.delete("/reasons/:id", miscellaneousReasonController.delete);
router.post("/reasons/:id", miscellaneousReasonController.status);

const miscellaneousDataController = require("../../../../../controllers/api/v1/admin/miscellaneous/miscellaneous_data.controller");
router.get("/data", miscellaneousDataController.findAll);
router.get("/data/:id", miscellaneousDataController.findOne);
router.post("/data",  miscellaneousDataController.create);
router.put("/data/:id", miscellaneousDataController.update);
router.delete("/data/:id", miscellaneousDataController.delete);
router.post("/data/:id", miscellaneousDataController.status);


router.post(
  "/",
  miscellaneousDataController.getDownloadExcelCustomerList
);


module.exports = router;
