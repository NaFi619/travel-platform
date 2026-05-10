"use client";
import { useEffect, useState, type ReactNode } from "react";
import { Users, DollarSign, Map, ShieldCheck, Loader2, ArrowLeft, Activity, Landmark, Wallet } from "lucide-react";
import Link from "next/link";

type User = { _id: string; name: string; email: string; };

type AdminStats = {
  userCount: number;
  totalRevenue: number;
  vaultBalance: number;
  tripCount: number;
  recentUsers: User[];
};

export default function AdminPanel() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) { window.location.href = "/login"; return; }
    const user = JSON.parse(storedUser);
    if (user.role !== "admin") { window.location.href = "/dashboard"; return; }

    const loadStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (res.ok) setStats(data);
        else setError(data.error || "Access Denied");
      } catch (e) { setError("Connection failed."); }
      finally { setLoading(false); }
    };
    loadStats();
  }, []);

  const handleWithdraw = () => {
    // We add a fallback to 0 so it never reads undefined
    const amount = stats?.vaultBalance?.toLocaleString() || "0";
    
    alert(`Initiating transfer of ৳${amount} to Admin Bank Account... \n\nStatus: Pending Approval`);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
      <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
      <p className="font-black uppercase tracking-widest text-xs">Accessing Vault...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f8fafc] p-8 lg:p-16 text-black">
      <header className="mb-12 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-black uppercase text-[10px] tracking-[0.3em] mb-2">
            <ShieldCheck size={14} /> Secure Admin Session
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Master Control</h1>
        </div>
        <Link href="/dashboard" className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl font-bold shadow-sm border border-slate-200 hover:shadow-md transition-all">
          <ArrowLeft size={18} /> Exit Admin
        </Link>
      </header>

      {/* FINANCIAL VAULT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-slate-900 rounded-[44px] p-10 text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-indigo-400 font-black uppercase text-[10px] tracking-[0.3em] mb-4">
              <Landmark size={16} /> Available Vault Balance
            </div>
            <h2 className="text-7xl font-black mb-10 tracking-tighter">
  ৳{stats?.vaultBalance ? stats.vaultBalance.toLocaleString() : "0"}
</h2>
            <button 
              onClick={handleWithdraw}
              className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white hover:text-slate-900 transition-all active:scale-95 flex items-center gap-3 shadow-xl"
            >
              <Wallet size={18} /> Transfer to Admin Bank
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all" />
        </div>

        <div className="bg-white p-10 rounded-[44px] border border-slate-100 shadow-sm flex flex-col justify-center">
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-2">Platform Revenue (Gross)</p>
          <p className="text-3xl font-black text-slate-900 mb-6">৳{(stats?.totalRevenue || 0).toLocaleString()}</p>
          <div className="pt-6 border-t border-slate-100">
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-1">Processing Fees (2%)</p>
            <p className="text-xl font-bold text-red-500">- ৳{((stats?.totalRevenue || 0) * 0.02).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <StatCard icon={<Users />} label="Total Users" value={stats?.userCount || 0} color="bg-blue-600" />
        <StatCard icon={<Map />} label="Trips Hosted" value={stats?.tripCount || 0} color="bg-indigo-600" />
        <StatCard icon={<Activity />} label="System Uptime" value="99.9%" color="bg-emerald-600" />
      </div>

      {/* RECENT USERS TABLE */}
      <div className="bg-white rounded-[40px] p-10 shadow-xl border border-slate-100">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Recent Signups</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[10px] uppercase tracking-[0.2em] border-b border-slate-50">
                <th className="pb-6 font-black">User Name</th>
                <th className="pb-6 font-black">Email Address</th>
                <th className="pb-6 font-black text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats?.recentUsers.map((user: User) => (
                <tr key={user._id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="py-6 font-black text-slate-800">{user.name}</td>
                  <td className="py-6 text-slate-500 font-medium">{user.email}</td>
                  <td className="py-6 text-right">
                    <span className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-[10px] font-black uppercase">Verified</span>
                  </td>
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
    <div className="bg-white p-10 rounded-[44px] border border-slate-100 shadow-sm flex items-center gap-8 hover:shadow-lg transition-all">
      <div className={`${color} text-white p-5 rounded-2xl`}>{icon}</div>
      <div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
      </div>
    </div>
  );
}