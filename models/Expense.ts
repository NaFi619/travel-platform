import mongoose, { Schema, model, models } from "mongoose";

const ExpenseSchema = new Schema({
  tripId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Trip", 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  payer: { 
    type: String, 
    default: "You" 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  // 🛠️ THE FIX: This must be defined as an array of objects
  // so it correctly stores travelerName and amountOwed
  splitDetails: [
    {
      travelerName: String,
      amountOwed: Number,
    }
  ],
}, { timestamps: true });

export const Expense = models.Expense || model("Expense", ExpenseSchema);