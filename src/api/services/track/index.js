const { status: httpStatus } = require("http-status");
const { Track } = require("../../models/track");
const ApiError = require("../../utils/ApiError");
const {
  Types: { ObjectId },
} = require("mongoose");
const { latestDate } = require("../../utils/date");
const { IN, OUT } = require("../../config/moves");

const track = async (trackData, movement) => {
  const track = await Track.findOne({
    user: ObjectId.createFromHexString(trackData.user),
    date: trackData.date,
  });

  if (!track) {
    if (movement.move === OUT) {
      // search prev date
      const prevTrack = await Track.findOne({
        user: ObjectId.createFromHexString(trackData.user),
        date: new Date(
          new Date(
            trackData.date.setDate(trackData.date.getDate() - 1)
          ).setHours(0, 0, 0, 0)
        ),
      });
      if (prevTrack && prevTrack.movements.reduce(latestDate).move === IN) {
        prevTrack.movements.push(movement);
        return await prevTrack.save();
      } else {
        throw new ApiError(httpStatus.BAD_REQUEST, `Please use IN action`);
      }
    } else {
      const trackedTime = new Track({ ...trackData, movements: [movement] });
      const savedTrackedTime = await trackedTime.save();
      return savedTrackedTime;
    }
  }

  const nextMove =
    track && track.movements.reduce(latestDate).move === IN ? OUT : IN;

  if (nextMove !== movement.move) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Please use ${nextMove} action`);
  }

  if (track) {
    track.movements.push(movement);
    return await track.save();
  }
};

const updateTrack = async (id, trackData) => {
  const trackedTimeDoc = await Track.findById(id);
  trackedTimeDoc.defaultSchedule =
    trackData.defaultSchedule ?? trackedTimeDoc.defaultSchedule;
  trackedTimeDoc.time = trackData.time;
  trackedTimeDoc.move = trackData.move;
  await trackedTimeDoc.save();
  return trackedTimeDoc;
};

const getTrackById = async (id) => {
  const trackDoc = await Track.findById(id);
  return trackDoc;
};

const getActiveTrackOfUser = async (userId, timeZone) => {
  const trackDocs = await Track.find({ user: userId })
    .sort({ date: "desc" })
    .limit(1);
  const latestTrack = trackDocs && trackDocs.length ? trackDocs[0] : null;
  if (latestTrack) {
    // Same date condition
    if (
      new Date(latestTrack.date).toLocaleDateString("en-us", { timeZone }) ===
      new Date().toLocaleDateString("en-us", { timeZone })
    ) {
      return latestTrack;
    }
    // Check if the last move is IN so that in the next day also we need to be able to clock out - so make it active
    if (latestTrack.movements.reduce(latestDate).move === IN) {
      return latestTrack;
    }
  }
  return null;
};

module.exports = {
  track,
  updateTrack,
  getTrackById,
  getActiveTrackOfUser,
};
