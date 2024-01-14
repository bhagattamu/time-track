const httpStatus = require("http-status");
const timeLogService = require("../../services/timelog");

const getAllTimeLogs = async (req, res) => {
  const timeZone = req.headers["timezone"];
  const user = req.user;
  const timeLogs = await timeLogService.getAllTimeLogs(user.id, timeZone);

  res.status(httpStatus.OK).json(timeLogs);
};

module.exports = {
  getAllTimeLogs,
};
