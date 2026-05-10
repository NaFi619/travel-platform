import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// 1. THE NEW SCHEMA (Updated to match your actual data)
const expenseSchema = new mongoose.Schema({
  tripId: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  payer: { type: String, default: "You" },
  splitDetails: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
}, { 
  strict: false, // This ensures it won't crash if extra fields are sent
  timestamps: true 
});

// 2. THE CACHE BREAKER
// We use "TripExpense" instead of "Expense" to force Mongoose to use the new rules.
const Expense = mongoose.models.TripExpense || mongoose.model("TripExpense", expenseSchema);

// GET: Fetch all expenses for a specific trip
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const tripId = searchParams.get("tripId");

    if (!tripId) return NextResponse.json({ message: "Trip ID required" }, { status: 400 });

    const expenses = await Expense.find({ tripId }).sort({ createdAt: -1 });
    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching expenses" }, { status: 500 });
  }
}

// POST: Add a new expense
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Map the incoming data to the schema
    const newExpense = await Expense.create({
      tripId: body.tripId,
      description: body.description,
      amount: Number(body.amount),
      payer: body.payer || "You",
      splitDetails: body.splitDetails || []
    });
    
    return NextResponse.json(newExpense, { status: 201 });
  } catch (error: unknown) {
    console.error("DEBUG - Save Failed:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

// DELETE: Remove an expense
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await Expense.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting" }, { status: 500 });
  }
}