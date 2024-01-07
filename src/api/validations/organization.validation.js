const Joi = require("joi");
const createValidator = require("./create-validator");

const TimeSchema = Joi.object({
  hour: Joi.number().required(),
  minute: Joi.number().required(),
});

const createOrganizationSchema = Joi.object({
  user: Joi.string().hex().length(24),
  name: Joi.string().min(2).required(),
  setting: Joi.object({
    startTime: TimeSchema,
    endTime: TimeSchema,
    breakTimes: Joi.array().items(
      Joi.object({
        breakTime: TimeSchema,
        durationInMin: Joi.number(),
        paid: Joi.boolean(),
      })
    ),
  }),
  default: Joi.boolean().required(),
});

module.exports = {
  validateOrganizationData: createValidator(createOrganizationSchema),
};
