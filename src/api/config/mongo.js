const mongoose = require("mongoose");
const logger = require("./logger");
const { mongo } = require("./vars");

mongoose.connection.on("error", (err) => {
  logger.error(`MongoDB connection error: ${err}`);
  process.exit(1);
});

exports.connect = () => {
  mongoose
    .connect(mongo.uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected!!!"));

  return mongoose.connection;
};
