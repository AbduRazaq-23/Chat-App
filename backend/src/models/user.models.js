import mongoose from "mongoose";

const userModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      required: true,
      default:
        "https://cdn.pixabay.com/photo/2013/07/13/13/38/man-161282_1280.png",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userModel);
module.exports = User;
