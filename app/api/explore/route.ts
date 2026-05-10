import { NextResponse } from "next/server";
import { Destination } from "@/models/Destination";
import connectDB from "@/lib/mongodb"; // Assuming you have a DB connector

export async function GET() {
  await connectDB();
  // Sort sponsored to the top (Feature 4)
  const data = await Destination.find({}).sort({ isSponsored: -1 });
  return NextResponse.json(data);
}