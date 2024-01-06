const httpStatus = require("http-status");
const {
  validateRegisterData,
  validateLoginDetail,
} = require("../../validations/auth.validation");
const userService = require("../../services/user");
const authService = require("../../services/auth");

const register = async (req, res) => {
  const user = req.body;
  const { error } = validateRegisterData(user);
  if (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.details[0].message);
  }
  const registeredUser = await userService.createUser(user);
  return res.status(httpStatus.CREATED).json(registeredUser);
};

const login = async (req, res) => {
  const loginDetail = req.body;
  const { error } = validateLoginDetail(loginDetail);
  if (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.details[0].message);
  }
  const {
    user,
    tokens: { accessToken, refreshToken },
  } = await authService.login(loginDetail);
  return res.status(httpStatus.OK).json({
    userId: user.id,
    roles: user.roles,
    name: `${user.firstName} ${
      user.middleName ? `${user.middleName} ${user.lastName}` : user.lastName
    }`,
    accessToken,
    refreshToken,
  });
};

module.exports = {
  register,
  login,
};
