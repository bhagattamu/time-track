const express = require("express");
const authRouter = require("./auth");
const userRouter = require("./user");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", auth("getUsers"), userRouter);

module.exports = router;
