const mongoose = require("mongoose");
const { roles, userStatus } = require("../constants/enum");
const { Schema } = require("./base.schema");

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      default: roles.USER,
      enum: [roles.ADMIN, roles.USER],
    },
    status: {
      type: String,
      required: true,
      default: userStatus.ACTIVE,
      enum: [userStatus.ACTIVE, userStatus.SUSPENDED],
    },
    description: {
      type: String,
    },
  },
  "User",
  undefined
);

const User = mongoose.model("User", userSchema);
module.exports = User;
