const httpStatus = require("http-status");
const { Track } = require("../../models/track");
const ApiError = require("../../utils/ApiError");

const track = async (trackData) => {
  const lastDoorOperation = await Track.find({
    user: trackData.user,
    date: trackData.date,
  })
    .sort({ time: -1 })
    .limit(1);

  const nextMove = lastDoorOperation?.move
    ? lastDoorOperation.move === "IN"
      ? "OUT"
      : "IN"
    : "IN";

  if (nextMove !== trackData.move) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Please use ${nextMove} action`);
  }

  const trackedTime = new Track(trackData);
  const savedTrackedTime = await trackedTime.save();
  return savedTrackedTime.transform();
};

const updateTrack = async (id, trackData) => {
  const trackedTimeDoc = await Track.findById(id);
  trackedTimeDoc.defaultSchedule =
    trackData.defaultSchedule ?? trackedTimeDoc.defaultSchedule;
  trackedTimeDoc.time = trackData.time;
  trackedTimeDoc.move = trackData.move;
  trackedTimeDoc.extra = trackData.extra;
  await trackedTimeDoc.save();
  return trackedTimeDoc.transform();
};

const getTrackById = async (id) => {
  const trackDoc = await Track.findById(id);
  return trackDoc.transform();
};

module.exports = {
  track,
  updateTrack,
  getTrackById,
};
