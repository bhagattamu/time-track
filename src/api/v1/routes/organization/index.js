const express = require("express");
const { organizationController } = require("../../../controllers");
const auth = require("../../../middlewares/auth");

const router = express.Router();

router.post(
  "/",
  auth("createOrganization"),
  organizationController.createOrganization
);

router.get(
  "/default",
  auth("getUserDefaultOrganization"),
  organizationController.getUserDefaultOrganization
);

router.get(
  "/:id",
  auth("getOrganizationsOfUser"),
  organizationController.getOrganizationsOfUser
);

router.put(
  "/:id",
  auth("updateOrganization"),
  organizationController.updateOrganization
);

module.exports = router;
