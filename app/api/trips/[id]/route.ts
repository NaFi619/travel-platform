import connectDB from "@/lib/mongodb";
import { Trip } from "@/models/Trip";
import { NextResponse } from "next/server";

// Prevents stale data
export const dynamic = "force-dynamic";

// --- GET: Fetch a single trip ---
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params; // 2. Await the promise
  const id = resolvedParams.id;
  try {
    await connectDB();
    const { id } = await params;
    const trip = await Trip.findById(id);

    if (!trip) {
      return NextResponse.json({ message: "Trip not found" }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    console.error("Error fetching trip:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// --- PATCH: Update trip details (like changing member count later) ---
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params; // 2. Await the promise
  const id = resolvedParams.id;
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const updatedTrip = await Trip.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true } // Returns the modified document
    );

    if (!updatedTrip) {
      return NextResponse.json({ message: "Trip not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTrip);
  } catch (error) {
    console.error("Error updating trip:", error);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

// --- DELETE: Remove a trip ---
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedTrip = await Trip.findByIdAndDelete(id);

    if (!deletedTrip) {
      return NextResponse.json({ message: "Trip not found" }, { status: 404 });
    }

    // Optional: You might also want to delete all expenses associated with this trip ID here
    
    return NextResponse.json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting trip:", error);
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}