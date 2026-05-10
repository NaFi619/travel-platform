"use client";
import { useState, useEffect } from "react";
import { User, Mail, ShieldAlert, Loader2, Save, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState<{ id: string; name: string; email: string; role?: string } | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        window.location.href = "/login";
        return;
      }
      
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setName(parsedUser.name || "");
    };

    loadUser();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, name }),
      });

      if (res.ok) {
        // Update local storage so the Navbar shows the new name!
        const updatedUser = { ...user, name };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setMessage("Profile updated successfully! 🎉");
      } else {
        setMessage("Failed to update profile.");
      }
    } catch (err) {
      setMessage("Connection error.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    const confirmDelete = confirm("Are you absolutely sure? This will delete your account forever. This action cannot be undone.");
    
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/settings?userId=${user.id}`, { method: "DELETE" });
      if (res.ok) {
        localStorage.removeItem("user");
        window.location.href = "/register"; // Kick them out to register page
      }
    } catch (err) {
      alert("Failed to delete account");
    }
  };

  if (!user) return (
    <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <main className="max-w-4xl mx-auto px-8 py-12 min-h-screen bg-[#f8fafc]">
      <header className="mb-12 border-b-2 border-slate-200 pb-6">
        <h2 className="text-5xl font-black text-slate-900 tracking-tight">Settings</h2>
        <p className="text-slate-600 mt-3 text-lg font-bold uppercase tracking-widest text-indigo-500">
          Manage your account
        </p>
      </header>

      <div className="space-y-10">
        {/* PROFILE SECTION */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
          <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <User className="text-indigo-500" /> Public Profile
          </h3>
          
          <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl">
            <div>
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 rounded-2xl p-4 font-bold outline-none border-2 border-transparent focus:border-indigo-600 transition-all text-slate-900" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Mail size={16} /> Email Address (Read Only)
              </label>
              <input 
                type="email" 
                className="w-full bg-slate-100 rounded-2xl p-4 font-bold text-slate-500 cursor-not-allowed outline-none" 
                value={user.email} 
                disabled 
              />
            </div>

            <button 
              type="submit" 
              disabled={saving || name === user.name} 
              className="bg-indigo-600 text-white font-black px-8 py-4 rounded-2xl hover:bg-slate-900 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl active:scale-95"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} 
              Save Changes
            </button>

            {message && (
              <p className="text-emerald-600 font-bold bg-emerald-50 p-4 rounded-xl inline-block mt-4">
                {message}
              </p>
            )}
          </form>
        </div>

        {/* DANGER ZONE */}
        <div className="bg-red-50 rounded-[32px] p-8 border border-red-100">
          <h3 className="text-2xl font-black text-red-600 mb-2 flex items-center gap-3">
            <ShieldAlert /> Danger Zone
          </h3>
          <p className="text-red-500/80 font-bold mb-6">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          
          <button 
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white font-black px-8 py-4 rounded-2xl hover:bg-red-700 transition-all flex items-center gap-2 shadow-xl active:scale-95"
          >
            <Trash2 size={20} /> Delete My Account
          </button>
        </div>
      </div>
    </main>
  );
}