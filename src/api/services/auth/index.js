const httpStatus = require("http-status");
const ApiError = require("../../utils/ApiError");
const userService = require("../user");
const tokenService = require("../token");

const login = async ({ email, password }) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }

  const tokens = await tokenService.generateAuthTokens(user);
  return {
    user,
    tokens,
  };
};

module.exports = {
  login,
};
