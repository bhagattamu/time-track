const express = require("express");
const { organizationSettingController } = require("../../../controllers");
const auth = require("../../../middlewares/auth");

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  auth("createOrganizationSetting"),
  organizationSettingController.createSetting
);

router.get(
  "/",
  auth("getOrganizationSetting"),
  organizationSettingController.getOrganizationSetting
);

router.put(
  "/",
  auth("updateOrganizationSetting"),
  organizationSettingController.updateOrganizationSetting
);

module.exports = router;
