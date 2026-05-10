import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  category: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: "Open" },
  createdAt: { type: Date, default: Date.now }
});

export const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);