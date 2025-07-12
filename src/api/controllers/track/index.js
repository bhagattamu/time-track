const { status: httpStatus } = require("http-status");
const trackService = require("../../services/track");
const { validateTrackData } = require("../../validations/track.validation");
const ApiError = require("../../utils/ApiError");
const { getCurDateWithZeroTime } = require("../../utils/date");

const createTrack = async (req, res) => {
  const { user, organization, move } = req.body;
  const timeZone = req.headers["timezone"];
  const { error } = validateTrackData(req.body);
  if (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.details[0].message);
  }

  // date localized according to timezone
  const newTrack = {
    user: user,
    organization: organization,
    date: getCurDateWithZeroTime(timeZone),
  };

  const movement = {
    time: new Date(),
    move: move,
  };
  const createdTrack = await trackService.track(newTrack, movement);
  return res.status(httpStatus.CREATED).json(createdTrack.transform());
};

const updateTrack = async (req, res) => {
  const trackBody = req.body;
  const id = req.params.id;

  const { error } = validateTrackData(trackBody);
  if (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.details[0].message);
  }
  const updatedTrack = await trackService
    .updateSetting(id, trackBody)
    .transform();
  return res.status(httpStatus.OK).json(updatedTrack);
};

const getTrackById = async (req, res) => {
  const id = req.params.id;
  const trackData = await trackService.getTrackById(id);
  return res
    .status(httpStatus.OK)
    .json(trackData ? trackData.transform() : null);
};

const getActiveTrack = async (req, res) => {
  const userId = req.user.id;
  const timeZone = req.headers["timezone"];
  const activeTrackData = await trackService.getActiveTrackOfUser(
    userId,
    timeZone
  );

  return res
    .status(httpStatus.OK)
    .json(activeTrackData ? activeTrackData.transform() : null);
};

module.exports = {
  createTrack,
  updateTrack,
  getTrackById,
  getActiveTrack,
};
