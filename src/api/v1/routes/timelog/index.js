const express = require("express");
const { timeLogController } = require("../../../controllers");
const auth = require("../../../middlewares/auth");

const router = express.Router();

router.get("/", auth("getAllTimeLogs"), timeLogController.getAllTimeLogs);

module.exports = router;
