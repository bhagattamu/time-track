const httpStatus = require("http-status");
const { User } = require("../../models/user");
const ApiError = require("../../utils/ApiError");

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  const newUser = new User(userBody);
  const savedUser = await newUser.save();
  return savedUser.transform();
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const getUsers = async () => {
  return User.find();
};

module.exports = {
  createUser,
  getUserByEmail,
  getUsers,
};
