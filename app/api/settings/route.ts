import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// UPGRADED SCHEMA: Added avatar, bio, phone, and location
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "" },
  bio: { type: String, default: "" },
  phone: { type: String, default: "" },
  location: { type: String, default: "" }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

// PUT: Update User Profile
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Grab all the new fields from the frontend request
    const { userId, name, avatar, bio, phone, location } = body;

    if (!userId || !name) {
      return NextResponse.json({ message: "Name and User ID are required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid User ID format" }, { status: 400 });
    }

    // Update the database with all the fields
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { 
        name: name,
        avatar: avatar,
        bio: bio,
        phone: phone,
        location: location
      }, 
      { new: true } 
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profile updated", user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Settings Update Error:", error);
    return NextResponse.json({ message: "Error updating profile" }, { status: 500 });
  }
}

// DELETE: Permanently Delete Account
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) return NextResponse.json({ message: "User ID required" }, { status: 400 });

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid User ID format" }, { status: 400 });
    }

    await User.findByIdAndDelete(userId);

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Account Deletion Error:", error);
    return NextResponse.json({ message: "Error deleting account" }, { status: 500 });
  }
}