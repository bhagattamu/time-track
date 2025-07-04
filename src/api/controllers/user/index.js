const userService = require("../../services/user");

const getUsers = async (_req, res) => {
  const result = await userService.getUsers();
  res.send(result.map((user) => user.transform()));
};

module.exports = {
  getUsers,
};
