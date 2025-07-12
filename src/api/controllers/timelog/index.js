const { status: httpStatus } = require("http-status");
const timeLogService = require("../../services/timelog");

const getAllTimeLogs = async (req, res) => {
  const user = req.user;
  const query = req.query;

  const timeLogsData = await timeLogService.getAllTimeLogs(user.id, query);

  res.status(httpStatus.OK).json({
    ...timeLogsData,
    data: timeLogsData.data.map((timelog) => timelog.transform()),
  });
};

module.exports = {
  getAllTimeLogs,
};
