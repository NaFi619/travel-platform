"use client";
import { useState, useEffect } from "react";
import { User, Mail, ShieldAlert, Loader2, Save, Trash2, Phone, MapPin, FileText, Image as ImageIcon } from "lucide-react";

interface SettingsUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  location?: string;
}

// Professional, free avatars from DiceBear
const AVATAR_OPTIONS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie"
];

export default function SettingsPage() {
  const [user, setUser] = useState<SettingsUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATAR_OPTIONS[0]);
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        window.location.href = "/login";
        return;
      }
      
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Load saved info or fallbacks
      setName(parsedUser.name || "");
      setAvatar(parsedUser.avatar || AVATAR_OPTIONS[0]);
      setBio(parsedUser.bio || "");
      setPhone(parsedUser.phone || "");
      setLocation(parsedUser.location || "");
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
        body: JSON.stringify({ 
          userId: user.id, 
          name, 
          avatar, 
          bio, 
          phone, 
          location 
        }),
      });

      if (res.ok) {
        // Update local storage so the new avatar/info is saved across the app
        const updatedUser = { ...user, name, avatar, bio, phone, location };
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
      setTimeout(() => setMessage(""), 3000);
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
        window.location.href = "/register";
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
      <header className="mb-12 border-b-2 border-slate-200 pb-6 flex items-center gap-6">
        <img src={avatar} alt="Profile" className="w-24 h-24 rounded-full bg-indigo-100 border-4 border-white shadow-xl" />
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tight">Settings</h2>
          <p className="text-slate-600 mt-2 text-lg font-bold uppercase tracking-widest text-indigo-500">
            Customize your identity
          </p>
        </div>
      </header>

      <div className="space-y-10">
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
          <form onSubmit={handleUpdateProfile} className="space-y-8">
            
            {/* AVATAR SELECTOR */}
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <ImageIcon className="text-indigo-500" size={20} /> Choose Avatar
              </h3>
              <div className="flex flex-wrap gap-4">
                {AVATAR_OPTIONS.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(imgUrl)}
                    className={`w-16 h-16 rounded-full transition-all border-4 ${avatar === imgUrl ? 'border-indigo-600 scale-110 shadow-lg' : 'border-transparent hover:scale-105 bg-slate-50 hover:bg-slate-100'}`}
                  >
                    <img src={imgUrl} alt={`Avatar ${idx}`} className="w-full h-full rounded-full" />
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* PERSONAL INFO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <User size={16} /> Full Name
                </label>
                <input type="text" className="w-full bg-slate-50 rounded-2xl p-4 font-bold outline-none border-2 border-transparent focus:border-indigo-600 transition-all text-slate-900" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Mail size={16} /> Email (Read Only)
                </label>
                <input type="email" className="w-full bg-slate-100 rounded-2xl p-4 font-bold text-slate-500 cursor-not-allowed outline-none" value={user.email} disabled />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Phone size={16} /> Phone Number
                </label>
                <input type="tel" placeholder="+1 234 567 890" className="w-full bg-slate-50 rounded-2xl p-4 font-bold outline-none border-2 border-transparent focus:border-indigo-600 transition-all text-slate-900" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <MapPin size={16} /> Location
                </label>
                <input type="text" placeholder="City, Country" className="w-full bg-slate-50 rounded-2xl p-4 font-bold outline-none border-2 border-transparent focus:border-indigo-600 transition-all text-slate-900" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <FileText size={16} /> Bio
              </label>
              <textarea placeholder="Tell us about your travel style..." rows={3} className="w-full bg-slate-50 rounded-2xl p-4 font-bold outline-none border-2 border-transparent focus:border-indigo-600 transition-all text-slate-900 resize-none" value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>

            <button type="submit" disabled={saving} className="bg-indigo-600 text-white font-black px-8 py-4 rounded-2xl hover:bg-slate-900 transition-all flex items-center gap-2 disabled:opacity-50 shadow-xl active:scale-95">
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} 
              Save Profile
            </button>

            {message && (
              <p className={`font-bold p-4 rounded-xl inline-block mt-4 ${message.includes("error") ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
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
          <button onClick={handleDeleteAccount} className="bg-red-600 text-white font-black px-8 py-4 rounded-2xl hover:bg-red-700 transition-all flex items-center gap-2 shadow-xl active:scale-95">
            <Trash2 size={20} /> Delete My Account
          </button>
        </div>
      </div>
    </main>
  );
}