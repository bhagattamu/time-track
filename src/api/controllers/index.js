const catchAsync = require("../utils/catchAsync");
const authController = require("./auth");
const userController = require("./user");
const organizationController = require("./organization");

const catchAsyncErrorInControllerMethods = (controller) => {
  Object.keys(controller).forEach(
    (key) => (controller[key] = catchAsync(controller[key]))
  );
};

catchAsyncErrorInControllerMethods(authController);
catchAsyncErrorInControllerMethods(userController);
catchAsyncErrorInControllerMethods(organizationController);

module.exports = {
  authController,
  userController,
  organizationController,
};
