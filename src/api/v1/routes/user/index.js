const express = require("express");
const { userController } = require("../../../controllers");
const auth = require("../../../middlewares/auth");

const router = express.Router();

router.get("/", auth("getUsers"), userController.getUsers);

module.exports = router;
