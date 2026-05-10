import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb"; // Use your main connection
import { Ticket } from "@/models/Ticket";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Connect to the Main/Admin DB
    await connectDB(); 

    // 2. Create the ticket in the database
    const newTicket = await Ticket.create(body);

    console.log("🎟️ New Ticket Saved:", newTicket._id);

    return NextResponse.json({ message: "Success", id: newTicket._id }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}