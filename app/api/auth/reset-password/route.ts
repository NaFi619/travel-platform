import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    // 1. Clean the input data aggressively
    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();

    console.log("--- RESET ATTEMPT START ---");
    console.log(`🔎 Input Received -> Email: [${cleanEmail}], OTP: [${cleanOtp}]`);

    // 2. First, find the user ONLY by email to inspect their state
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      console.log("❌ DB ERROR: No user exists with this email address.");
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 3. Log what the DB actually has vs what the user sent
    console.log(`💾 DB State -> Stored OTP: [${user.resetOtp}], Expiry: ${user.resetOtpExpires}`);
    
    // 4. Compare OTPs manually for debugging
    const isOtpMatch = user.resetOtp === cleanOtp;
    const isExpired = user.resetOtpExpires && user.resetOtpExpires < new Date();

    if (!isOtpMatch) {
      console.log("❌ MISMATCH: The OTP provided does not match the one in the database.");
      return NextResponse.json({ message: "Invalid code. Please check your email." }, { status: 400 });
    }

    if (isExpired) {
      console.log("⏰ EXPIRED: The OTP has timed out.");
      return NextResponse.json({ message: "Code expired. Please request a new one." }, { status: 400 });
    }

    // 5. If everything is valid, update the password
    console.log("✅ SUCCESS: OTP matches and is valid. Updating password...");
    
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Use findOneAndUpdate to ensure the save is atomic and avoids middleware issues
    await User.updateOne(
      { _id: user._id },
      { 
        $set: { password: hashedPassword },
        $unset: { resetOtp: "", resetOtpExpires: "" } // Removes the fields from the document
      }
    );

    console.log("--- RESET ATTEMPT SUCCESSFUL ---");
    return NextResponse.json({ message: "Password updated successfully!" }, { status: 200 });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("❌ API CRASH:", errorMessage);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}