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

const OrganizationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    name: {
      type: String,
      trim: true,
      require: true,
    },
    setting: {
      startTime: TimeSchema,
      endTime: TimeSchema,
      breakTimes: [
        {
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
        },
      ],
    },
    default: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

OrganizationSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      "id",
      "name",
      "setting",
      "default",
      "createdAt",
      "updatedAt",
    ];
    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

const Organization = new mongoose.model("Organization", OrganizationSchema);

module.exports = { OrganizationSchema, Organization };
