const express = require("express");
const router = express.Router();
const { Validation, Validate } = require("../../../../../helper/validation/validations");


// Role routes
const RolesController = require("../../../../../controllers/api/v1/admin/role_and_prmissions/roles.controller");
router.get("/role", RolesController.findAll);
router.get("/role/:id", RolesController.findOne);
router.post("/role", Validation.name, Validate, RolesController.create);
router.put("/role/:id", Validation.name, Validate, RolesController.update);
router.delete("/role/:id", RolesController.delete);
router.post("/role/:id", RolesController.status);

// Employee routes
const EmployeeController = require("../../../../../controllers/api/v1/admin/Employee_management/employee.controller");
router.put(
  "/doctor-commission/:id",
  EmployeeController.doctorCommission
);
router.get("/users", EmployeeController.findAll);
router.get("/users/:id", EmployeeController.findOne);
router.post("/users", Validation.name, Validate, EmployeeController.create);
router.put("/users/:id", Validation.name, Validate, EmployeeController.update);
router.delete("/users/:id", EmployeeController.delete);
router.post("/users/:id", EmployeeController.status);
router.post(
  "/download",
  EmployeeController.getDownloadExcelUserList
);



module.exports = router;
