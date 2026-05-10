import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// DYNAMIC SCHEMA: Kept super simple
const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String },
  packageType: { type: String },
  groupSize: { type: Number },
  price: { type: Number },
  date: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { strict: false }); 

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

// GET: Fetch User Bookings (Safe Version)
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "User ID required" }, { status: 400 });
    }

    // SAFE FIX: Just use standard string matching. No complicated ObjectId casting.
    const bookings = await Booking.find({ userId: String(userId) }).sort({ createdAt: -1 });

    return NextResponse.json(bookings, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ message: "Error fetching bookings" }, { status: 500 });
  }
}

// POST: Create New Booking
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Make sure userId is saved as a string to prevent future crashes
    const safeBody = {
      ...body,
      userId: String(body.userId)
    };

    const newBooking = await Booking.create(safeBody);
    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ message: "Error booking trip" }, { status: 500 });
  }
}