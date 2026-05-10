"use client";
import { useState } from "react";
import { LifeBuoy, Send, MessageCircle, FileQuestion, CheckCircle2 } from "lucide-react";
import FormInput from "@/components/FormInput";



export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
  name: "",
  email: "",
  category: "Database Access",
  message: ""
});

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const res = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      alert("Something went wrong. Please try again.");
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-6">
        <div className="max-w-md w-full text-center bg-white p-10 rounded-[40px] shadow-xl border border-slate-100">
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Message Sent!</h2>
          <p className="text-slate-500 font-medium mb-8">
            Our team will review your request and get back to you within 24 hours.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-indigo-600 transition-all"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">How can we help?</h1>
          <p className="text-slate-500 font-medium max-w-lg mx-auto">
            Have a question about your database or account? Were here to help you move forward.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Contact Cards */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                <FileQuestion size={24} />
              </div>
              <h3 className="font-bold text-slate-900">Knowledge Base</h3>
              <p className="text-sm text-slate-500 mt-1">Read guides and common fixes.</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                <MessageCircle size={24} />
              </div>
              <h3 className="font-bold text-slate-900">Live Chat</h3>
              <p className="text-sm text-slate-500 mt-1">Available Mon-Fri, 9am - 5pm.</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 lg:p-10 rounded-[40px] shadow-xl border border-slate-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Your Name</label>
                    <input required type="text" className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 outline-none text-black font-bold" placeholder="Name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email Address</label>
                    <input required type="email" className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 outline-none text-black font-bold" placeholder="Enter your email address" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Issue Category</label>
                  <select className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 outline-none appearance-none text-black font-semibold">
                    <option>Database Access</option>
                    <option>Billing & Subscription</option>
                    <option>Technical Bug</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Message</label>
                  <textarea 
                    required 
                    rows={5} 
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 outline-none resize-none text-black font-bold" 
                    placeholder="Describe your issue in detail..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? "Sending..." : "Send Support Request"}
                  {!loading && <Send size={18} />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}