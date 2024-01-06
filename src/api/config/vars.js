require("dotenv").config();

const vars = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "dev",
  apiVersion: process.env.VERSION || 1,
  mongo: {
    uri: process.env.MONGO_URI || process.env.MONGO_TEST_URI,
  },
  jwt: {
    secret: "testsecret",
    accessTokenExpirationMinutes: "5m",
    refreshTokenExpirationDays: "2d",
  },
};

module.exports = vars;
