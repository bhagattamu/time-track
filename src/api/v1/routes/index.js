const express = require("express");
const authRouter = require("./auth");
const userRouter = require("./user");
const organizationRouter = require("./organization");
const organizationSettingRouter = require("./setting");
const trackRouter = require("./track");
const timeLogRouter = require("./timelog");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/organizations/:orgId/settings", organizationSettingRouter);
router.use("/organizations", organizationRouter);
router.use("/tracks", trackRouter);
router.use("/time-logs", timeLogRouter);

module.exports = router;
