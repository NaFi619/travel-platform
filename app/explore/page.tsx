"use client";
import { useState } from "react";
import { Check, Lock, Star, MessageCircle, ArrowRight, Zap, Building2, Map, Users, Loader2 } from "lucide-react";
import { DESTINATIONS } from "@/constants/destinations";

export default function ExploreMarketplace() {
  const [activeTab, setActiveTab] = useState<"budget" | "elite">("budget");
  const [selectedDest, setSelectedDest] = useState(DESTINATIONS[0]);
  const [groupSize, setGroupSize] = useState(2);
  const [isBooking, setIsBooking] = useState(false); // 🛠️ Added loading state

  // Dynamic price calculation (Group discount logic)
  const calculatePrice = (base: number) => {
    const discount = groupSize > 5 ? 0.9 : groupSize > 2 ? 0.95 : 1;
    return Math.round(base * discount);
  };

  // 🛠️ THE MAGIC: Sends the booking to your MongoDB database
  const handleBookPackage = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("Please sign in to book a package!");
      window.location.href = "/login";
      return;
    }

    const user = JSON.parse(storedUser);
    setIsBooking(true);

    const tripData = {
      userId: user.id,
      title: selectedDest.title,
      location: selectedDest.location,
      packageType: activeTab,
      groupSize: groupSize,
      price: calculatePrice(selectedDest.packages[activeTab].price),
      date: new Date().toISOString().split("T")[0], 
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripData),
      });

      // Grab the exact response from the backend
      const data = await res.json();

      if (res.ok) {
        window.location.href = "/dashboard"; 
      } else {
        // 🛠️ THIS WILL SHOW THE ACTUAL ERROR
        alert(`Backend Error: ${data.message || "Unknown error"}`);
        console.error("Backend returned:", data);
      }
    } catch (error) {
      alert(`Connection error: ${error}`);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white p-6 lg:p-12 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-10">
        
        {/* LEFT: Destination Selector & Details */}
        <div className="col-span-12 lg:col-span-8 space-y-10">
          <header>
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              <Zap size={12} fill="currentColor" /> Sponsored: Bangladesh Tourism Board
            </div>
            <h1 className="text-7xl font-black tracking-tighter mb-4">Explore<br/>Packages</h1>
          </header>

          {/* Destination Cards */}
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {DESTINATIONS.map(dest => (
              <button 
                key={dest.id}
                onClick={() => setSelectedDest(dest)}
                className={`min-w-[280px] group relative rounded-[40px] overflow-hidden border transition-all ${
                  selectedDest.id === dest.id ? 'border-indigo-500 scale-[1.02]' : 'border-white/5 opacity-60'
                }`}
              >
                <img src={dest.image} alt={dest.title} className="h-48 w-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                <div className="p-6 bg-[#16161a]">
                  <h3 className="font-black text-xl">{dest.title}</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{dest.location}</p>
                </div>
              </button>
            ))}
          </div>

          {/* PACKAGE DUEL SECTION */}
          <section className="bg-[#16161a] rounded-[50px] p-10 border border-white/5 relative overflow-hidden">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black tracking-tight">Package Comparison</h2>
              <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
                <button onClick={() => setActiveTab("budget")} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'budget' ? 'bg-white text-black' : 'text-slate-500'}`}>Budget</button>
                <button onClick={() => setActiveTab("elite")} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'elite' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Elite</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Whats Included</p>
                <ul className="space-y-4">
                  {[selectedDest.packages[activeTab].stay, selectedDest.packages[activeTab].transport, ...selectedDest.packages[activeTab].perks].map((p, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-300">
                      <div className="p-1 bg-green-500/20 rounded-full"><Check size={12} className="text-green-500"/></div> {p}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex flex-col justify-center items-center bg-black/20 rounded-[40px] p-8 border border-white/5">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Starts from</p>
                <div className="text-6xl font-black tracking-tighter mb-2">৳{calculatePrice(selectedDest.packages[activeTab].price).toLocaleString()}</div>
                <p className="text-[10px] text-indigo-400 font-black uppercase mb-8 tracking-widest">Per person / {groupSize} Travelers</p>
                
                <div className="w-full space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 px-2">
                    <span>Travelers</span>
                    <span>{groupSize}</span>
                  </div>
                  <input type="range" min="1" max="12" value={groupSize} onChange={(e) => setGroupSize(parseInt(e.target.value))} className="w-full accent-indigo-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                </div>
                
                {/* 🛠️ THE BOOKING BUTTON */}
                <button 
                  onClick={handleBookPackage}
                  disabled={isBooking}
                  className="w-full flex justify-center items-center gap-2 bg-white text-black mt-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-50"
                >
                  {isBooking ? <Loader2 className="animate-spin" size={16} /> : `Book ${activeTab} Package`}
                </button>
              </div>
            </div>
          </section>

          {/* REVENUE: TOP STAYS (Affiliate) */}
          <section>
            <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 mb-6">
              <Building2 size={16}/> Top Rated Stays (Partner Links)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedDest.topStays.map(stay => (
                <div key={stay.name} className="flex items-center justify-between bg-white/5 p-6 rounded-[30px] border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                  <div>
                    <p className="font-black text-lg">{stay.name}</p>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star size={10} fill="currentColor"/> <span className="text-[10px] font-black text-slate-400">{stay.rating} / 5.0</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-indigo-400">{stay.price}</p>
                    <p className="text-[9px] font-bold text-slate-600 uppercase group-hover:text-white transition-colors">Book Now <ArrowRight size={8} className="inline"/></p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT: Revenue Side Panels */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          
          {/* REVENUE: DIGITAL BLUEPRINTS */}
          <div className="bg-indigo-600 p-8 rounded-[45px] relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
              <Map size={120} />
            </div>
            <h3 className="text-2xl font-black mb-2 leading-tight">Master Itinerary</h3>
            <p className="text-white/70 text-xs font-medium mb-6">Minute-by-minute photography & food guide for {selectedDest.title}.</p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-[10px] font-black uppercase bg-black/20 p-3 rounded-xl"><Check size={14}/> Day 1: Cloud Sunrise (Free)</div>
              <div className="flex items-center justify-between text-[10px] font-black uppercase bg-white/10 p-3 rounded-xl opacity-60">
                <span className="flex items-center gap-3"><Lock size={14}/> Day 2 & 3: Secret Spots</span>
                <span className="text-indigo-200">Locked</span>
              </div>
            </div>
            <button className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all">
              Unlock for ৳199
            </button>
          </div>

          {/* REVENUE: LEAD GEN / GUIDE BOOKING */}
          <div className="bg-[#16161a] p-8 rounded-[45px] border border-white/5">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <Users size={20} className="text-green-500" /> Local Experts
            </h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 overflow-hidden">
                  <img src="https://i.pravatar.cc/150?u=guide1" alt="Guide" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-black text-sm">Arif Rahman</p>
                  <p className="text-[10px] font-bold text-slate-500">Sajek Expert • 5★ (120+)</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium">I provide private Chander Gari and home-cooked meals at Konglak Para.</p>
              <button className="w-full flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-[#25D366]/20 hover:bg-[#25D366] hover:text-white transition-all">
                <MessageCircle size={14} fill="currentColor" /> Chat on WhatsApp
              </button>
            </div>
            <p className="text-[9px] text-center text-slate-600 mt-6 font-black uppercase tracking-widest">Verified by TravelFlow</p>
          </div>
        </div>
      </div>
    </main>
  );
}