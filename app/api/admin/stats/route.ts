import connectDB from "@/lib/mongodb";
import { User } from "@/models/User";
import { Expense } from "@/models/Expense";
import { Trip } from "@/models/Trip"; // Or Booking
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();

    console.log("--- DB Check Started ---");
    await connectDB();
    
    // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const dbStatus = mongoose.connection.readyState;
    console.log("Database Connection Status:", dbStatus === 1 ? "✅ CONNECTED" : "❌ NOT CONNECTED");
    
    const [users, expenses, trips] = await Promise.all([
      User.find({}),
      Expense.find({}),
      Trip.find({})
    ]);

    // Ensure amount is treated as a number and handle missing values
    const totalRevenue = expenses.reduce((acc, curr) => {
      const val = Number(curr.amount) || 0;
      return acc + val;
    }, 0);

    return NextResponse.json({
      userCount: users.length,
      totalRevenue: totalRevenue,
      tripCount: trips.length,
      recentUsers: users.slice(-5).reverse(),
    });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 });
  }
}