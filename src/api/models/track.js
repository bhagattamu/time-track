const mongoose = require("mongoose");
const TimeSchema = require("./time");
const BreakTimesSchema = require("./break");
const { ScheduleSchema } = require("./setting");

const TrackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      require: true,
    },
    date: {
      type: String,
      require: true,
    },
    defaultSchedule: ScheduleSchema,
    time: {
      type: Date,
      default: new Date(),
    },
    move: {
      type: String,
      require: true,
    },
    extra: {
      earlyWork: {
        done: {
          type: Boolean,
          default: false,
        },
        time: TimeSchema,
        breakTimes: [BreakTimesSchema],
      },
      lateNightWork: {
        done: {
          type: Boolean,
          default: false,
        },
        time: TimeSchema,
        breakTimes: [BreakTimesSchema],
      },
    },
  },
  {
    timestamps: true,
  }
);

// const TrackSchema = new mongoose.Schema(
//   {
//     date: {
//       type: Date,
//       require: true,
//     },
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       require: true,
//     },
//     organization: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Organization",
//       require: true,
//     },
//     defaultSchedule: ScheduleSchema,
//     doorTaps: [
//       {
//         time: {
//           type: Date,
//           default: new Date(),
//         },
//         move: {
//           type: String,
//           require: true,
//         },
//       },
//     ],
//     extra: {
//       earlyWork: {
//         done: {
//           type: Boolean,
//           default: false,
//         },
//         time: TimeSchema,
//         breakTimes: [BreakTimesSchema],
//       },
//       lateNightWork: {
//         done: {
//           type: Boolean,
//           default: false,
//         },
//         time: TimeSchema,
//         breakTimes: [BreakTimesSchema],
//       },
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

TrackSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      "user",
      "organization",
      "defaultSchedule",
      "time",
      "move",
      "extra",
      "createdAt",
      "updatedAt",
    ];
    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

const Track = new mongoose.model("Track", TrackSchema);

module.exports = {
  TrackSchema,
  Track,
};
