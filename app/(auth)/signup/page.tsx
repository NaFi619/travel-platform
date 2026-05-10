"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import FormInput from "@/components/FormInput"; // Optional: Use your new component here
import { useSearchParams } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const urlMessage = searchParams.get("message");
  const [error, setError] = useState(urlMessage || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // --- THE CRITICAL ADDITION ---
        // We must save the user data so the Navbar and Dashboard 
        // know the login was successful.
        // Inside your Login logic
localStorage.setItem("user", JSON.stringify({ id: "your-user-id-from-db", name: "Your Name" }));
        
        // Success! Go straight to dashboard
        router.push("/dashboard"); 
        router.refresh(); // Forces the Navbar to re-check localStorage
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-6">
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[10%] left-[15%] w-96 h-96 bg-indigo-200/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[15%] w-96 h-96 bg-blue-200/30 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-indigo-100/50 border border-slate-100 backdrop-blur-sm">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
              <Sparkles size={12} /> Join the Journey
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h1>
            <p className="text-slate-500 mt-2 font-medium">Start splitting trips with ease.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold text-center border border-red-100">
                {error}
              </div>
            )}

            {/* I updated the text-black and font-medium here for better visibility as you requested */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  required
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all text-slate-900 font-bold" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all text-slate-900 font-bold" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all text-slate-900 font-bold" 
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-4 rounded-2xl mt-4 transition-all duration-300 shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-slate-500 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </main>
  );
}