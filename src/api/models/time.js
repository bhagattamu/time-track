const mongoose = require("mongoose");

const TimeSchema = new mongoose.Schema(
  {
    hour: {
      type: Number,
      require: true,
      min: [0, "Hour can not be in negative"],
      max: [24, "Hour can not be more than 24 in 24 hour format"],
    },
    minute: {
      type: Number,
      require: true,
      min: [0, "Minute can not be in negative"],
      max: [60, "Minute can not be more than 60 in 60 minute format"],
    },
  },
  {
    _id: false,
  }
);

module.exports = TimeSchema;
