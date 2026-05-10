import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// 1. EMERGENCY SCHEMA: Defines the database structure on the fly if you don't have a models/Expense.ts file!
const expenseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: "Other" },
  date: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Check if model exists to prevent Next.js overwrite errors
const Expense = mongoose.models.Expense || mongoose.model("Expense", expenseSchema);

// GET: Fetch User Expenses
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) return NextResponse.json({ message: "User ID required" }, { status: 400 });

    const expenses = await Expense.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(expenses, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching expenses" }, { status: 500 });
  }
}

// POST: Create New Expense
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newExpense = await Expense.create(body);
    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error saving expense" }, { status: 500 });
  }
}

// DELETE: Remove Expense
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });

    await Expense.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting" }, { status: 500 });
  }
}