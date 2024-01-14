const Joi = require("joi");
const createValidator = require("./create-validator");

const createOrganizationSchema = Joi.object({
  user: Joi.string().hex().length(24),
  name: Joi.string().min(2).required(),
  default: Joi.boolean().required(),
});

module.exports = {
  validateOrganizationData: createValidator(createOrganizationSchema),
};
