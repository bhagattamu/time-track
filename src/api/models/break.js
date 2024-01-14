const mongoose = require("mongoose");
const TimeSchema = require("./time");

const BreakTimesSchema = new mongoose.Schema({
  _id: false,
  breakTime: TimeSchema,
  durationInMin: {
    type: Number,
    min: 0,
  },
  paid: {
    type: Boolean,
    default: false,
  },
});

module.exports = BreakTimesSchema;
