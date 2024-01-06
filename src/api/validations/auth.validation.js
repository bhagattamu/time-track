const Joi = require("joi");
const createValidator = require("./create-validator");

const registerUserSchema = Joi.object({
  firstName: Joi.string().min(2).required(),
  middleName: Joi.string().allow("").optional(),
  lastName: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
});

module.exports = {
  validateRegisterData: createValidator(registerUserSchema),
  validateLoginDetail: createValidator(loginSchema),
};
