const express = require("express");
const router = express.Router();



//career routes
router.use("/vission-mission", require("./vission_mission.index.js"));



//qualification routes
router.use("/our-team", require("./our_team.index.js"));

module.exports = router;