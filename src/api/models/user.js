const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { roles } = require("../config/roles");

const SALT = 10;

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
    },
    roles: {
      type: [String],
      enum: roles,
      default: ["user"],
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({ email });
  return !!user;
};

UserSchema.pre("save", function (next) {
  const userDoc = this;
  if (!userDoc.isModified("password")) return next();
  bcrypt.hash(userDoc.password, SALT, (err, hash) => {
    if (err) return next(err);
    userDoc.password = hash;
    return next();
  });
});

UserSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      "id",
      "firstName",
      "middleName",
      "lastName",
      "email",
      "roles",
      "createdAt",
      "updatedAt",
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = new mongoose.model("User", UserSchema);

module.exports = {
  UserSchema,
  User,
};
