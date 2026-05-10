"use client";
import { X, MapPin, Calendar, Camera } from "lucide-react";

export default function CreateTripModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-slate-900/40">
      <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black tracking-tight">Plan a new Journey</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Image Placeholder */}
            <div className="w-full h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[30px] flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-indigo-400 transition">
              <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400 group-hover:text-indigo-600">
                <Camera size={20} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Add Cover Image</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-slate-400 ml-2 tracking-widest">Trip Title</label>
                <input type="text" placeholder="e.g. Summer in Santorini" className="w-full mt-1 bg-slate-50 border-none rounded-2xl p-4 font-medium focus:ring-2 focus:ring-indigo-600 outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 ml-2 tracking-widest leading-loose">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="City, Country" className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 font-medium focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 ml-2 tracking-widest leading-loose">When?</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Nov 2024" className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 font-medium focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full bg-indigo-600 text-white font-bold py-5 rounded-[24px] shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95">
              Launch Trip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}