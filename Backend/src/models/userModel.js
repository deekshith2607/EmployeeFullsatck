import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      lowercase: true
    },

    passwordHash: {
      type: String
    },

    authProvider: {
      type: String,
      enum: ["local", "google","both"],
      default: "local"
    },

    role: {
      type: String,
      enum: ["HR", "MANAGER", "EMPLOYEE"],
      required: true
    },

    avatar: {
      type: String
    },

    refreshToken: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);


export default User;