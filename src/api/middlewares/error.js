const mongoose = require("mongoose");
const { status: httpStatus } = require("http-status");
const { env } = require("../config/vars");
const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");

const errorConverter = (err, _req, _res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

const errorHandler = (err, _req, res, _next) => {
  let { statusCode, message } = err;
  if (env === "production" && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;
  if (env === "production") logger.error(err.stack);
  const response = {
    code: statusCode,
    message,
    ...(env === "development" && { stack: err.stack }),
  };

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
