"use client";
import { useState } from "react";
import { MessageCircle, X, Send, Smile } from "lucide-react";

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* The Chat Window */}
      {isOpen && (
        <div className="bg-white w-[350px] h-[500px] rounded-[30px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
            <div>
              <h3 className="font-bold">TravelFlow Support</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> We are online
              </p>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50 space-y-4">
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700 font-medium max-w-[80%]">
              Hi there! How can we help you with your database today? 👋
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-2">
            <button className="text-slate-400 hover:text-slate-600"> <Smile size={20} /> </button>
            <input 
              placeholder="Type a message..." 
              className="flex-1 text-sm font-bold text-slate-900 outline-none"
            />
            <button className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-slate-900 transition-all">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* The Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 hover:bg-slate-900 transition-all"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
}