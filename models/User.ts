import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetOtp: { type: String, default: null }, // 👈 Ensure this exists
  resetOtpExpires: { type: Date, default: null }, // 👈 Ensure this exists
}, { timestamps: true });

export const User = models.User || model("User", UserSchema);