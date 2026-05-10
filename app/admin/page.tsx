"use client";
import { useEffect, useState, type ReactNode } from "react";
import { Users, DollarSign, Map, ShieldCheck, Loader2, Trash2 } from "lucide-react";

type User = { _id: string; name: string; email: string; };

type AdminStats = {
  userCount: number;
  totalRevenue: number;
  tripCount: number;
  recentUsers: User[];
};

export default function AdminPanel() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // 🔒 1. SECURITY GATEKEEPER
    const storedUser = localStorage.getItem("user");
    
    if (!storedUser) {
      window.location.href = "/login"; // Kick out if not logged in
      return;
    }

    const user = JSON.parse(storedUser);
    
    // Check if they have the admin role we set on the login page
    if (user.role !== "admin") {
      window.location.href = "/dashboard"; // Kick normal users to the dashboard
      return;
    }

    // 📊 2. FETCH REAL DATA (If they pass the security check)
    const loadStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        
        if (res.ok && data) {
          setStats({
            userCount: data.userCount || 0,
            totalRevenue: data.totalRevenue || 0,
            tripCount: data.tripCount || 0,
            recentUsers: data.recentUsers || [],
          });
        }
      } catch (e: unknown) {
        console.error("DB Fetch failed:", e);
        setError("Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
  }, []);

  if (!stats) return null;

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-black">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Admin Control</h1>
        </div>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard icon={<Users />} label="Total Users" value={stats.userCount} color="bg-blue-500" />
        <StatCard icon={<DollarSign />} label="Platform Spend" value={`৳${stats.totalRevenue.toLocaleString()}`} color="bg-emerald-500" />
        <StatCard icon={<Map />} label="Active Trips" value={stats.tripCount} color="bg-amber-500" />
      </div>

      {/* RECENT USERS TABLE */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
        <h2 className="text-xl font-black text-slate-900 mb-6">Recent Signups</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-widest border-b border-slate-50">
                <th className="pb-4 font-black">User</th>
                <th className="pb-4 font-black">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats.recentUsers.map((user: User) => (
                <tr key={user._id} className="group">
                  <td className="py-4 font-bold text-slate-700">{user.name}</td>
                  <td className="py-4 text-slate-500">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function StatCard({ icon, label, value, color }: { icon: ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5">
      <div className={`${color} text-white p-4 rounded-2xl`}>{icon}</div>
      <div>
        <p className="text-slate-400 text-xs font-black uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}