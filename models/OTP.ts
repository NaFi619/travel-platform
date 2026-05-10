import mongoose, { Schema, model, models } from "mongoose";

const OTPSchema = new Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 } // Auto-deletes after 10 mins
});

export const OTP = models.OTP || model("OTP", OTPSchema);