const catchAsync = require("../utils/catchAsync");
const authController = require("./auth");
const userController = require("./user");
const organizationController = require("./organization");
const organizationSettingController = require("./setting");
const trackController = require("./track");
const timeLogController = require("./timelog");

const catchAsyncErrorInControllerMethods = (controller) => {
  Object.keys(controller).forEach(
    (key) => (controller[key] = catchAsync(controller[key]))
  );
};

catchAsyncErrorInControllerMethods(authController);
catchAsyncErrorInControllerMethods(userController);
catchAsyncErrorInControllerMethods(organizationController);
catchAsyncErrorInControllerMethods(organizationSettingController);
catchAsyncErrorInControllerMethods(trackController);
catchAsyncErrorInControllerMethods(timeLogController);

module.exports = {
  authController,
  userController,
  organizationController,
  organizationSettingController,
  trackController,
  timeLogController,
};
