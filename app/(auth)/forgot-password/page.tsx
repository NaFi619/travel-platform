"use client";
import { useState } from "react";
import { Mail, ArrowRight, Loader2, KeyRound, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Pass
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async () => {
    if (!email) return setError("Please enter your email");
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase() })
      });
      const data = await res.json();
      
      if (res.ok) {
        setStep(2);
      } else {
        setError(data.message || "Failed to send code");
      }
    } catch (err) {
      setError("Connection error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndReset = async () => {
    if (!otp || !newPassword) return setError("Fill in all fields");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email.toLowerCase(), 
          otp: otp.trim(), 
          newPassword 
        })
      });
      const data = await res.json();

      if (res.ok) {
        alert("Password updated! Please login.");
        window.location.href = "/login";
      } else {
        setError(data.message || "Invalid or expired code");
      }
    } catch (err) {
      setError("Request failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-6">
      <div className="w-full max-w-md bg-white p-10 rounded-[40px] shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-4">
            {step === 1 ? <Mail size={32} /> : <ShieldCheck size={32} />}
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {step === 1 ? "Reset Password" : "Final Step"}
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            {step === 1 ? "Enter email to receive code" : "Verify code and set password"}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold text-center border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {step === 1 ? (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email Address</label>
                <input 
                  type="email"
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all text-black font-medium"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button 
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Send Code"}
                {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">6-Digit Code</label>
                <input 
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-center text-xl font-black tracking-widest text-indigo-600 focus:ring-2 focus:ring-indigo-600 outline-none"
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">New Password</label>
                <input 
                  type="password"
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <button 
                onClick={handleVerifyAndReset}
                disabled={loading}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
                {!loading && <KeyRound size={18} />}
              </button>
            </>
          )}

          <p className="text-center mt-6 text-sm text-slate-500 font-medium">
            Remember it? <Link href="/login" className="text-indigo-600 font-bold hover:underline">Back to Sign In</Link>
          </p>
        </div>
      </div>
    </main>
  );
}