const Joi = require("joi");
const createValidator = require("./create-validator");
const { ScheduleSchema } = require("../models/setting");

const timeSchema = Joi.object({
  hour: Joi.number().required(),
  minute: Joi.number().required(),
});

const breakTimeSchema = Joi.object({
  breakTime: timeSchema,
  durationInMin: Joi.number(),
  paid: Joi.boolean(),
});

const scheduleSchema = Joi.object({
  startTime: timeSchema,
  endTime: timeSchema,
  breakTimes: Joi.array().items(breakTimeSchema),
  holiday: Joi.boolean(),
});

const createTrackSchema = Joi.object({
  user: Joi.string().hex().length(24),
  organization: Joi.string().hex().length(24),
  // time: Joi.date().required(),
  move: Joi.string().required().equal("IN", "OUT"),
  // extra: Joi.object({
  //   earlyWork: Joi.object({
  //     done: Joi.boolean,
  //     time: timeSchema,
  //     breakTimes: Joi.array().items(breakTimeSchema),
  //   }).optional(),
  //   lateNightWork: Joi.object({
  //     done: Joi.boolean,
  //     time: timeSchema,
  //     breakTimes: Joi.array().items(breakTimeSchema),
  //   }).optional(),
  // }).optional(),
});

module.exports = {
  validateTrackData: createValidator(createTrackSchema),
};
