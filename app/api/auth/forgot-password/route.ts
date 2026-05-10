import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/User";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ... (existing imports)

// app/api/auth/forgot-password/route.ts

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log("❌ DB CHECK: User not found in database for email:", email);
      return NextResponse.json({ message: "No account found with this email" }, { status: 404 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await User.findOneAndUpdate({ email }, { resetOtp: otp, resetOtpExpires: expiry });

    console.log("✅ DB CHECK: User found and OTP saved. Attempting to send email...");

    const response = await resend.emails.send({
      from: "TravelFlow <onboarding@resend.dev>",
      to: email,
      subject: "Reset Code: " + otp,
      html: `<h1>Your code is ${otp}</h1>`
    });

    if (response.error) {
      console.log("❌ RESEND ERROR:", response.error);
      return NextResponse.json({ message: "Resend failed to deliver" }, { status: 500 });
    }

    return NextResponse.json({ message: "OTP sent" }, { status: 200 });
  } catch (error: unknown) {
    console.error("❌ CRITICAL API ERROR:", (error as Error).message);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}