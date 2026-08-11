const express = require("express");
const router = express.Router();

router.use("/admin", require("./admin/index"));

router.use("/common", require("./common/index"));

// router.use("/mobile", require("./mobile/index"));

router.use("/website", require("./website/index"));

// router.use("/delivery-boy", require("./delivery_boy/index"));

module.exports = router;
