const Joi = require("joi");
const createValidator = require("./create-validator");

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
})
  .optional()
  .allow(null);

const organizationSettingSchema = Joi.object({
  organization: Joi.string().hex().length(24),
  schedules: Joi.object({
    sun: scheduleSchema,
    mon: scheduleSchema,
    tue: scheduleSchema,
    wed: scheduleSchema,
    thu: scheduleSchema,
    fri: scheduleSchema,
    sat: scheduleSchema,
  }),
});

module.exports = {
  validateOrganizationSettingData: createValidator(organizationSettingSchema),
};
