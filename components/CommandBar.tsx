"use client";
import { useEffect, useState } from "react";
import { Search, Plane, Settings, Users, X } from "lucide-react";
interface CommandItemProps {
  icon: React.ReactNode; // This allows any JSX element (like <Plane size={18}/>)
  label: string;
  shortcut: string;
}

export default function CommandBar() {
  const [isOpen, setIsOpen] = useState(false);

  // Listen for CMD+K or CTRL+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] p-6">
      <div className="bg-white w-full max-w-2xl rounded-[28px] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
        <div className="flex items-center border-b px-6 py-4">
          <Search className="text-slate-400 mr-4" size={20} />
          <input 
            autoFocus
            placeholder="Type a command or search..." 
            className="flex-1 text-lg outline-none font-medium"
          />
          <button onClick={() => setIsOpen(false)} className="text-xs font-bold bg-slate-100 text-slate-400 px-2 py-1 rounded">ESC</button>
        </div>
        
        <div className="p-4 space-y-1">
          <CommandItem icon={<Plane size={18}/>} label="Go to Japan Trip" shortcut="G J" />
          <CommandItem icon={<Users size={18}/>} label="Invite Friends" shortcut="I" />
          <CommandItem icon={<Settings size={18}/>} label="Account Settings" shortcut="S" />
        </div>
      </div>
    </div>
  );
}

function CommandItem({ icon, label, shortcut }: CommandItemProps) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-indigo-50 rounded-xl cursor-pointer group transition-colors">
      <div className="flex items-center gap-3 text-slate-600 group-hover:text-indigo-600">
        {/* Render the icon directly */}
        <span className="flex items-center justify-center">
          {icon}
        </span> 
        <span className="font-bold">{label}</span>
      </div>
      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
        {shortcut}
      </span>
    </div>
  );
}