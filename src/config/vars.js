require("dotenv").config();

const vars = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "dev",
  apiVersion: process.env.VERSION || 1,
};

module.exports = vars;
