import mongoose, { Schema, model, models } from "mongoose";

const TripSchema = new mongoose.Schema({
  title: String,
  location: String,
  startDate: String,
  userId: { type: String, index: true },
  members: { type: mongoose.Schema.Types.Mixed, default: [] },
  paidMembers: { type: Array, default: [] }, // 🛠️ Track who settled
  baseCurrency: { type: String, default: "$" }, // 🛠️ Store currency preference
  image: String,
}, { timestamps: true });

export const Trip = models.Trip || model("Trip", TripSchema);