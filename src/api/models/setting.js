const mongoose = require("mongoose");
const BreakTimesSchema = require("./break");
const TimeSchema = require("./time");

const ScheduleSchema = new mongoose.Schema({
  _id: false,
  startTime: TimeSchema,
  endTime: TimeSchema,
  breakTimes: [BreakTimesSchema],
  holiday: {
    type: Boolean,
    default: false,
  },
});

const OrganizationSettingSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      require: true,
    },
    schedules: {
      sun: ScheduleSchema,
      mon: ScheduleSchema,
      tue: ScheduleSchema,
      wed: ScheduleSchema,
      thu: ScheduleSchema,
      fri: ScheduleSchema,
      sat: ScheduleSchema,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

OrganizationSettingSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      "id",
      "organization",
      "schedules",
      "createdAt",
      "updatedAt",
    ];
    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

const OrganizationSetting = new mongoose.model(
  "OrganizationSetting",
  OrganizationSettingSchema
);

module.exports = {
  ScheduleSchema,
  OrganizationSettingSchema,
  OrganizationSetting,
};
