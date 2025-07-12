const { Track } = require("../../models/track");
const { makeDateFromString } = require("../../utils/date");

const getAllTimeLogs = async (userId, query) => {
  const {
    dataPerPage = 10,
    page = 1,
    startDate: startDateQuery,
    endDate: endDateQuery,
  } = query;
  const startDate = makeDateFromString(startDateQuery);
  const endDate = makeDateFromString(endDateQuery);

  const skip = (page - 1) * dataPerPage;

  const db = Track.find({
    user: userId,
    // Filter according to date
    ...(startDate && endDate
      ? { date: { $gte: startDate, $lte: endDate } }
      : {}),
  });

  const total = await Track.countDocuments(db);
  const timeLogs = await db.skip(skip).limit(dataPerPage).exec();

  return {
    meta: {
      page,
      dataPerPage,
      total,
      pageCount: Math.floor((total + dataPerPage - 1) / dataPerPage),
    },
    data: timeLogs,
  };
};

module.exports = {
  getAllTimeLogs,
};
