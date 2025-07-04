const { status: httpStatus } = require("http-status");
const {
  validateRegisterData,
  validateLoginDetail,
} = require("../../validations/auth.validation");
const userService = require("../../services/user");
const authService = require("../../services/auth");
const ApiError = require("../../utils/ApiError");

const register = async (req, res) => {
  const user = req.body;
  const { error } = validateRegisterData(user);
  if (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.details[0].message);
  }
  const registeredUser = await userService.createUser(user);
  return res.status(httpStatus.CREATED).json(registeredUser.transform());
};

const login = async (req, res) => {
  const loginDetail = req.body;
  const { error } = validateLoginDetail(loginDetail);
  if (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.details[0].message);
  }
  const {
    user,
    tokens: { accessToken, refreshToken },
  } = await authService.login(loginDetail);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }
  setHttpOnlyCookieRefreshToken(res, refreshToken);
  return res.status(httpStatus.OK).json({
    userId: user.id,
    roles: user.roles,
    name: `${user.firstName} ${
      user.middleName ? `${user.middleName} ${user.lastName}` : user.lastName
    }`,
    accessToken,
  });
};

const refreshToken = async (req, res) => {
  const cookieRefreshToken = req.cookies?.refreshToken || "";
  if (!cookieRefreshToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "No refresh token provided");
  }
  const {
    user,
    tokens: { accessToken, refreshToken },
  } = await authService.refreshToken(cookieRefreshToken);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
  }
  setHttpOnlyCookieRefreshToken(res, refreshToken);

  return res.status(httpStatus.OK).json({
    userId: user.id,
    roles: user.roles,
    name: `${user.firstName} ${
      user.middleName ? `${user.middleName} ${user.lastName}` : user.lastName
    }`,
    accessToken,
  });
};

const logout = async (req, res) => {
  const cookieRefreshToken = req.cookies?.refreshToken || "";
  if (!cookieRefreshToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "No refresh token provided");
  }
  // await authService.logout(cookieRefreshToken);
  res.clearCookie("refreshToken");
  return res.status(httpStatus.NO_CONTENT).send();
};

const setHttpOnlyCookieRefreshToken = (res, value, options = {}) => {
  res.cookie("refreshToken", value, {
    httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript
    secure: process.env.NODE_ENV === "production", // Send cookie only over HTTPS in production
    // sameSite: "strict", // Helps mitigate CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // Example: 7 days in milliseconds
    ...options, // Spread any additional options passed
  });
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
};
