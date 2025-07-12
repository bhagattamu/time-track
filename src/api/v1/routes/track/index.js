const express = require("express");
const { trackController } = require("../../../controllers");
const auth = require("../../../middlewares/auth");

const router = express.Router();

router.post("/", auth("createTrack"), trackController.createTrack);

router.put("/", auth("updateTrack"), trackController.updateTrack);

router.get("/active", auth("getActiveTrack"), trackController.getActiveTrack);

router.get("/:id", auth("getTrackById"), trackController.getTrackById);

module.exports = router;
