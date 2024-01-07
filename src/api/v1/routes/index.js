const express = require("express");
const authRouter = require("./auth");
const userRouter = require("./user");
const organizationRouter = require("./organization");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/organizations", organizationRouter);

module.exports = router;
