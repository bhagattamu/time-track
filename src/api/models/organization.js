const mongoose = require("mongoose");

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
    default: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

OrganizationSchema.index({ user: 1, name: 1 }, { unique: true });

OrganizationSchema.method({
  transform() {
    const transformed = {};
    const fields = ["id", "name", "default", "createdAt", "updatedAt"];
    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

const Organization = new mongoose.model("Organization", OrganizationSchema);

module.exports = { OrganizationSchema, Organization };
