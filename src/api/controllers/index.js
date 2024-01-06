const catchAsync = require("../utils/catchAsync");
const authController = require("./auth");
const userController = require("./user");

const catchAsyncErrorInControllerMethods = (controller) => {
  Object.keys(controller).forEach(
    (key) => (controller[key] = catchAsync(controller[key]))
  );
};

catchAsyncErrorInControllerMethods(authController);
catchAsyncErrorInControllerMethods(userController);

module.exports = {
  authController,
  userController,
};
