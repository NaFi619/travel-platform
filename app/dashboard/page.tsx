"use client";
import { useState, useEffect } from "react";
import { Plus, MapPin, Calendar, Loader2, X, Trash2, LogOut } from "lucide-react";
import Link from "next/link";

interface Trip {
  _id: string;
  title: string;
  location: string;
  startDate: string;
  members: string[] | number;
  image?: string;
}

export default function Dashboard() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);

  const [newTrip, setNewTrip] = useState({
    title: "",
    location: "",
    startDate: "",
    members: 1,
  });

  useEffect(() => {
    // Wrap everything inside the async function
    const loadDashboardData = async () => {
      // 1. Get User
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        window.location.href = "/login";
        return;
      }
      
      const parsedUser = JSON.parse(storedUser);
      
      // 🛠️ FIX: Now this is inside an async function, React won't complain!
      setUser(parsedUser); 

      // 2. Load Trips
      setLoading(true);
      try {
        const res = await fetch(`/api/trips?userId=${parsedUser.id}&t=${Date.now()}`, {
          cache: "no-store"
        });
        if (res.ok) {
          const data = await res.json();
          setTrips(data);
        }
      } catch (e) {
        console.error("Failed to load trips", e);
      } finally {
        setLoading(false);
      }
    };

    // Run the function
    loadDashboardData();

    // 🔄 Auto-refresh listeners
    const handleVisibility = () => {
      if (document.visibilityState === "visible") loadDashboardData();
    };

    window.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", loadDashboardData);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", loadDashboardData);
    };
  }, []);

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return; // Prevent saving if user isn't loaded
    
    setSaving(true);
    const membersArray = Array.from({ length: newTrip.members }, (_, i) => `Member ${i + 1}`);

    try {
      const res = await fetch("/api/trips/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTrip,
          members: membersArray,
          userId: user.id, // 🛠️ ATTACH REAL USER ID HERE
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setTrips((prev) => [created, ...prev]);
        setShowModal(false);
        setNewTrip({ title: "", location: "", startDate: "", members: 1 });
      }
    } catch (err) {
      alert("Error saving trip");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTrip = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this trip?")) return;
    try {
      const res = await fetch(`/api/trips/${id}`, { method: "DELETE" });
      if (res.ok) setTrips((prev) => prev.filter((t) => t._id !== id));
    } catch (err) { console.error(err); }
  };

  // 🚪 SIGN OUT FUNCTION
  const handleSignOut = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <main className="max-w-7xl mx-auto px-8 py-12 min-h-screen bg-[#f8fafc]">
      <header className="flex justify-between items-end mb-12 border-b-2 border-slate-200 pb-6">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tight">Your Journeys</h2>
          <p className="text-slate-600 mt-3 text-lg font-bold uppercase tracking-widest text-indigo-500">
            Welcome, {user?.name || "Traveler"}
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowModal(true)} 
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-slate-900 transition-all shadow-xl active:scale-95">
            <Plus size={20} strokeWidth={3} /> New Trip
          </button>
          
          <button 
            onClick={handleSignOut} 
            className="flex items-center gap-2 bg-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-black hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95">
            <LogOut size={20} strokeWidth={3} /> Sign Out
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4"><Loader2 className="animate-spin text-indigo-600" size={48} /><p className="font-black">Loading Trips...</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {trips.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-400 font-bold text-xl">
              No trips yet. Click New Trip to start your adventure!
            </div>
          ) : (
            trips.map((trip) => (
              <div key={trip._id} className="relative group">
                <button onClick={(e) => handleDeleteTrip(e, trip._id)} className="absolute top-6 right-6 z-20 bg-red-500 text-white p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110"><Trash2 size={20} /></button>
                <Link href={`/package/${trip._id}`} className="block relative h-[450px] rounded-[40px] overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-3">
                  <img src={trip.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800"} className="absolute inset-0 w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90" />
                  <div className="absolute bottom-0 p-8 w-full">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-indigo-400 text-sm font-black uppercase tracking-widest"><Calendar size={16} /> {trip.startDate || "Date TBD"}</div>
                      <div className="bg-white/10 px-3 py-1 rounded-lg text-xs font-bold text-white border border-white/20">
                        {Array.isArray(trip.members) ? trip.members.length : (trip.members || 1)} travelers
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-2">{trip.title}</h3>
                    <div className="flex items-center gap-2 text-slate-300 font-bold"><MapPin size={16} className="text-indigo-400" /> {trip.location}</div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[48px] p-12 relative shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900"><X size={32} /></button>
            <form onSubmit={handleCreateTrip} className="space-y-6 text-slate-900">
              <h3 className="text-3xl font-black text-center uppercase mb-8">New Trip</h3>
              <input placeholder="Trip Title" className="w-full bg-slate-100 rounded-2xl p-5 font-bold outline-none border-2 border-transparent focus:border-indigo-600 transition-all" required value={newTrip.title} onChange={(e) => setNewTrip({...newTrip, title: e.target.value})} />
              <input placeholder="Destination" className="w-full bg-slate-100 rounded-2xl p-5 font-bold outline-none border-2 border-transparent focus:border-indigo-600 transition-all" required value={newTrip.location} onChange={(e) => setNewTrip({...newTrip, location: e.target.value})} />
              <input type="date" className="w-full bg-slate-100 rounded-2xl p-5 font-bold outline-none border-2 border-transparent focus:border-indigo-600 transition-all" required value={newTrip.startDate} onChange={(e) => setNewTrip({...newTrip, startDate: e.target.value})} />
              <div className="space-y-2">
                <div className="flex items-center gap-4 bg-slate-100 rounded-[24px] p-2">
                  <button type="button" onClick={() => setNewTrip(p => ({ ...p, members: Math.max(1, p.members - 1) }))} className="w-12 h-12 bg-white text-slate-900 rounded-xl font-black shadow-sm"> - </button>
                  <span className="flex-1 text-center font-black text-xl">{newTrip.members} Travelers</span>
                  <button type="button" onClick={() => setNewTrip(p => ({ ...p, members: p.members + 1 }))} className="w-12 h-12 bg-white text-slate-900 rounded-xl font-black shadow-sm"> + </button>
                </div>
              </div>
              <button disabled={saving} className="w-full bg-indigo-600 text-white font-black text-xl py-6 rounded-[28px] hover:bg-slate-900 transition-all flex justify-center items-center shadow-xl">
                {saving ? <Loader2 className="animate-spin" /> : "Launch Trip"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}