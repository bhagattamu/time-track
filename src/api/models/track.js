const mongoose = require("mongoose");
const { IN } = require("../config/moves");

const MovementSchema = new mongoose.Schema({
  time: {
    type: Date,
    default: new Date(),
  },
  move: {
    type: String,
    require: true,
  },
});

const OffsetSchema = new mongoose.Schema({
  minute: {
    type: Number,
    require: true,
  },
  reason: {
    type: String,
    require: true,
  },
});

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
    // Not localized according to timezone
    date: {
      type: Date,
      require: true,
    },
    movements: {
      type: [MovementSchema],
    },
    // positive offset to add time and negative offset to subtract time
    offsets: {
      type: [OffsetSchema],
    },
  },
  {
    timestamps: true,
  }
);

TrackSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      "id",
      "user",
      "organization",
      "date",
      "movements",
      "offsets",
      "createdAt",
      "updatedAt",
    ];
    // Calculate total time according to movements
    const [totalTime, _] = this["movements"]
      .sort((a, b) => new Date(a.time) - new Date(b.time))
      .reduce(
        (acc, cur) => {
          const [prevTotal, prevTimelogMovement] = acc;
          if (!prevTimelogMovement) {
            return [0, cur];
          } else if (cur.move === IN) {
            return [prevTotal, cur];
          } else {
            // Diff (Out time - In time) and convert to hour diff
            const time = Number(
              (new Date(cur.time) - new Date(prevTimelogMovement.time)) /
                (1000 * 60 * 60)
            );
            return [prevTotal + time, cur];
          }
        },
        [0, null]
      );

    // Total time after offset
    transformed["totalHour"] =
      totalTime +
      // offsets is set in minute - so converted to hour
      this["offsets"].reduce(
        (totalOffset, curOffset) => totalOffset + curOffset,
        0
      ) /
        60;

    // Transformed Values for other field
    fields.forEach((field) => {
      if (field === "date") {
        transformed[field] = new Date(this[field]).toLocaleDateString();
      } else transformed[field] = this[field];
    });

    return transformed;
  },
});

const Track = new mongoose.model("Track", TrackSchema);

module.exports = {
  TrackSchema,
  Track,
};
