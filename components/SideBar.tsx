"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Compass, Receipt, Settings, HelpCircle, LogOut } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
  localStorage.removeItem("user"); // Deletes the saved session
  window.location.href = "/login"; // Kicks them back to login
};

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "Expenses", href: "/expenses", icon: Receipt },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Support", href: "/support", icon: HelpCircle },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 fixed left-0 top-0 p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">TF</div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">TravelFlow</h1>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                isActive ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 font-bold text-sm hover:bg-red-50 rounded-2xl transition-all">
        <LogOut size={18} /> Sign Out
      </button>
    </aside>
  );
}