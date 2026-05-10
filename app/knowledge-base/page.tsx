"use client";
import { BookOpen, Search, Code, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

const categories = [
  { title: "Getting Started", icon: <Zap />, items: 5, desc: "Learn how to set up your first database." },
  { title: "API Reference", icon: <Code />, items: 12, desc: "Detailed documentation for developers." },
  { title: "Security & Privacy", icon: <ShieldCheck />, items: 8, desc: "How we protect your multi-tenant data." },
];

export default function KnowledgeBase() {
  return (
    <main className="min-h-screen bg-[#f8fafc] py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Search Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-slate-900 mb-6">How can we help?</h1>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              className="w-full bg-white border-2 border-slate-100 rounded-[30px] p-6 pl-14 text-slate-900 font-bold shadow-xl focus:border-indigo-600 outline-none transition-all"
              placeholder="Search for articles (e.g. MongoDB setup)..."
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group cursor-pointer">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                {cat.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">{cat.title}</h3>
              <p className="text-slate-500 text-sm font-medium mb-6">{cat.desc}</p>
              <div className="flex items-center text-indigo-600 font-bold text-sm">
                {cat.items} Articles <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}