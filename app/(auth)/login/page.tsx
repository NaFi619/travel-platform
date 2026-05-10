"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  const emailInput = formData.email.trim().toLowerCase();
  const passwordInput = formData.password;

  // 👑 1. SPECIFIC ADMIN CHECK
  // Change these to whatever you want your admin login to be
  if (emailInput === "admin@yourdomain.com" && passwordInput === "admin123") {
    // Save a special admin token to local storage
    localStorage.setItem("user", JSON.stringify({ 
      role: "admin", 
      email: emailInput, 
      name: "Super Admin" 
    }));
    window.location.href = "/admin";
    return; // Stop here, don't check the database!
  }

  // 👤 2. REGULAR USER CHECK (Checks the Database)
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      // Save normal user to local storage
      const userFromDB = data.user || data;
      localStorage.setItem("user", JSON.stringify({
        id: userFromDB._id || "user-id",
        role: "user",
        email: emailInput,
        name: userFromDB.name || "User"
      }));
      window.location.href = "/dashboard"; // Normal users go here
    } else {
      setError(data.message || "Invalid email or password");
      setLoading(false);
    }
  } catch (err) {
    console.error("Login Error:", err);
    setError("Connection error. Please try again.");
    setLoading(false);
  }
};


  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-6 text-black">
      <div className="w-full max-w-md">
        <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-indigo-100/50 border border-slate-100">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-indigo-200">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold text-center border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-950 uppercase tracking-wider ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all text-black font-medium" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-950 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all text-black font-medium" 
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-slate-900 text-white font-bold py-4 rounded-2xl mt-4 transition-all duration-300 shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
            
          </form>

          <div className="mt-6 flex flex-col items-center gap-3">
            <Link 
              href="/forgot-password" 
              className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <p className="text-center mt-8 text-sm text-slate-500 font-medium">
            New here? <Link href="/signup" className="text-indigo-600 font-bold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </main>
  );
} // Final bracket restored