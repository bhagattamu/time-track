const express = require("express");
const cors = require("cors");
const ExpressMongoSanitize = require("express-mongo-sanitize");
const { default: helmet } = require("helmet");
const compression = require("compression");
const httpStatus = require("http-status");
const passport = require("passport");
const { apiVersion, env } = require("./vars");
const routes = require(`../v${apiVersion}/routes`);
const { errorConverter, errorHandler } = require("../middlewares/error");
const jwtStrategy = require("./passport");
const ApiError = require("../utils/ApiError");
const morgan = require("./morgan");

const app = express();

if (env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(ExpressMongoSanitize());

// gzip compression
app.use(compression());

app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

app.get("/health", (_req, res) => {
  res.status(200).send("Healthy");
});

app.use(`/api/v${apiVersion}`, routes);

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
