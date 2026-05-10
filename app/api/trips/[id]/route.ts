import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    
    const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({}, { strict: false }));
    const Trip = mongoose.models.Trip || mongoose.models.Booking || mongoose.model("Trip", new mongoose.Schema({}, { strict: false }));
    const Expense = mongoose.models.TripExpense || mongoose.models.Expense || mongoose.model("TripExpense", new mongoose.Schema({}, { strict: false }));

    const [users, expenses, trips] = await Promise.all([
      User.find({}),
      Expense.find({}),
      Trip.find({})
    ]);

    const totalRevenue = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    
    // Simulate Net Vault Balance (Revenue minus 2% platform fee)
    const vaultBalance = totalRevenue * 0.98;

    return NextResponse.json({
      userCount: users.length,
      totalRevenue: totalRevenue,
      vaultBalance: vaultBalance,
      tripCount: trips.length,
      recentUsers: users.slice(-5).reverse(),
    });

  } catch (error: unknown) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
// 
