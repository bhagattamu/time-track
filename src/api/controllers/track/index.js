const httpStatus = require("http-status");
const settingService = require("../../services/setting");
const trackService = require("../../services/track");
const { validateTrackData } = require("../../validations/track.validation");
const days = require("../../config/days");

const createTrack = async (req, res) => {
  const { user, organization, move } = req.body;
  const timeZone = req.header["timeZone"];
  const { error } = validateTrackData(req.body);
  if (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.details[0].message);
  }

  const setting = await settingService.getSetting(organization);
  const newTrack = {
    user: user,
    organization: organization,
    date: new Date().toLocaleDateString("en", { timeZone }),
    defaultSchedule:
      setting.schedules[
        new Date()
          .toLocaleDateString("en", { timeZone, weekday: "long" })
          .toLowerCase()
          .slice(0, 3)
      ],
    time: new Date(),
    move: move,
  };
  const createdTrack = await trackService.track(newTrack);
  return res.status(httpStatus.CREATED).json(createdTrack);
};

const updateTrack = async (req, res) => {
  const trackBody = req.body;
  const id = req.params.id;

  const { error } = validateTrackData(trackBody);
  if (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.details[0].message);
  }
  const updatedTrack = await trackService.updateSetting(id, trackBody);
  return res.status(httpStatus.OK).json(updatedTrack);
};

const getTrackById = async (req, res) => {
  const id = req.params.id;
  const trackData = await trackService.getTrackById(id);
  return res.status(httpStatus.OK).json(trackData);
};

module.exports = {
  createTrack,
  updateTrack,
  getTrackById,
};
