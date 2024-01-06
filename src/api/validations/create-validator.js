const createValidator = (schema) => (payload) => {
  return schema.validate(payload);
};

module.exports = createValidator;
