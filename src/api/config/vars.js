require("dotenv").config();

const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;

const vars = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "development",
  apiVersion: process.env.VERSION || 1,
  mongo: {
    uri: `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mongo:${DB_PORT}/${DB_NAME}?authSource=admin`,
  },
  jwt: {
    secret: "testsecret",
    accessTokenExpirationMinutes: "1d",
    refreshTokenExpirationDays: "2d",
  },
};

module.exports = vars;
