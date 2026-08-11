const express = require("express");
const router = express.Router();


const applicationController = require("../../../../../controllers/api/v1/admin/career/career_applications.controller.js")
//career routes
router.use("/career-form", require("./career.index.js"));

router.get("/career-applications", applicationController.findAll);
router.delete("/career-applications/:id", applicationController.delete);

//qualification routes
router.use("/qualification", require("./qualification.index.js"));

module.exports = router;