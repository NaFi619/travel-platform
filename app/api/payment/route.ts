import { NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/mongodb";
// import Booking from "@/models/Booking";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { userId, destinationId, destinationName, packageType, travelers, amount } = data;

    // 1. Connect to Database
    // await connectToDatabase();

    // 2. Create the record in MongoDB
    /*
    const newBooking = await Booking.create({
      userId,
      destinationId,
      destinationName,
      packageType,
      travelers,
      amountPaid: amount,
      status: "Confirmed",
      dateBooked: new Date()
    });
    */

    // 3. Return success response
    return NextResponse.json(
      { message: "Booking confirmed successfully!", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Payment API Error:", error);
    return NextResponse.json(
      { message: "Failed to process booking." },
      { status: 500 }
    );
  }
}