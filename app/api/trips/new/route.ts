import connectDB from "@/lib/mongodb";
import { Trip } from "@/models/Trip";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, location, startDate, userId, members, image } = body;

    await connectDB();

    // 🛠️ THE FIX: 
    // If members is an array, we keep it as an array.
    // If it's a number/string, we ensure it's handled.
    // This stops the "Always 1 member" bug.
    const finalMembers = Array.isArray(members) ? members : (Number(members) || 1);

    const newTrip = await Trip.create({ 
      title, 
      location, 
      startDate, 
      userId, 
      members: finalMembers,
      image: image || ""
    });

    // Log this to your terminal so you can see if it actually saved!
    console.log("✅ Trip Saved Successfully:", newTrip._id);

    return NextResponse.json(newTrip, { status: 201 });
  } catch (error: unknown) {
    console.error("❌ API Error:", error);
    let errorMessage = "Internal Server Error";
    if (error instanceof Error) errorMessage = error.message;
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}