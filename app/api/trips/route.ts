import connectDB from "@/lib/mongodb";
import { Trip } from "@/models/Trip";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) return NextResponse.json({ message: "User ID required" }, { status: 400 });

    // 🛠️ CRITICAL SAFETY FIX:
    // Only attempt to cast to ObjectId if it's actually a valid MongoDB ID format.
    // If we don't do this, Next.js will crash if the ID is slightly malformed.
    let filterQuery: Record<string, unknown> = { userId };

    if (mongoose.Types.ObjectId.isValid(userId)) {
      filterQuery = {
        $or: [
          { userId },
          { userId: new mongoose.Types.ObjectId(userId) }
        ]
      };
    }

    const trips = await Trip.find(filterQuery).sort({ createdAt: -1 });

    console.log(`✅ Found ${trips.length} trips for user ${userId}`);

    return NextResponse.json(trips, {
      headers: { "Cache-Control": "no-store" }
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ message: "Error fetching trips" }, { status: 500 });
  }
}