"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, ReceiptText, Loader2, MapPin, PlusCircle, Users, Trash2, CheckCircle2, Save, Download, Coins } from "lucide-react";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface SplitDetail {
  travelerName: string;
  amountOwed: number;
}

interface Trip {
  _id: string;
  title: string;
  location: string;
  startDate: string;
  members: string[];
  paidMembers: string[]; // 🛠️ Added
  baseCurrency: string;  // 🛠️ Added
}

interface Expense {
  _id: string;
  description: string;
  amount: number;
  date: string;
  payer: string;
  splitDetails: SplitDetail[]; 
}

export default function TripDetails() {
  const params = useParams();
  const id = params?.id;
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal");
  const [customSplits, setCustomSplits] = useState<Record<string, string>>({});
  
  const [editableMembers, setEditableMembers] = useState<string[]>([]);
  const [isUpdatingNames, setIsUpdatingNames] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [tripRes, expenseRes] = await Promise.all([
          fetch(`/api/trips/${id}`, { cache: 'no-store' }),
          fetch(`/api/expenses?tripId=${id}`, { cache: 'no-store' })
        ]);
        
        const tripData = await tripRes.json();
        const expenseData = await expenseRes.json();
        
        setTrip(tripData);
        setExpenses(Array.isArray(expenseData) ? expenseData : []);
        setEditableMembers(Array.isArray(tripData.members) ? tripData.members : ["You"]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // 🛠️ PDF EXPORT LOGIC
  const exportToPDF = () => {
    if (!trip) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`${trip.title} - Expense Report`, 14, 22);
    doc.setFontSize(11);
    doc.text(`Location: ${trip.location}`, 14, 30);

    const tableData = expenses.map(ex => [
      ex.description,
      `${trip.baseCurrency || '$'}${ex.amount.toFixed(2)}`,
      ex.splitDetails.map(s => `${s.travelerName}: ${s.amountOwed.toFixed(2)}`).join(", ")
    ]);

    autoTable(doc, {
      head: [['Description', 'Total', 'Splits']],
      body: tableData,
      startY: 40,
    });

    doc.save(`${trip.title}_Summary.pdf`);
  };

  // 🛠️ SETTLEMENT TOGGLE
  const togglePaidStatus = async (name: string) => {
    if (!trip) return;
    const isPaid = trip.paidMembers?.includes(name);
    const newPaidList = isPaid 
      ? trip.paidMembers.filter(m => m !== name)
      : [...(trip.paidMembers || []), name];

    try {
      const res = await fetch(`/api/trips/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paidMembers: newPaidList }),
      });
      if (res.ok) setTrip({ ...trip, paidMembers: newPaidList });
    } catch (err) { alert("Failed to update status"); }
  };

  const handleUpdateNames = async () => {
    setIsUpdatingNames(true);
    try {
      const res = await fetch(`/api/trips/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ members: editableMembers }),
      });
      if (res.ok) alert("Settings saved!");
    } catch (err) { alert("Error saving"); } finally { setIsUpdatingNames(false); }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm("Remove this expense?")) return;
    try {
      const res = await fetch(`/api/expenses?id=${expenseId}`, { method: "DELETE" });
      if (res.ok) setExpenses(prev => prev.filter(e => e._id !== expenseId));
    } catch (err) { alert("Error deleting"); }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !id || !trip) return;
    setIsSaving(true);
    const totalAmount = parseFloat(amount);
    let finalSplitDetails: SplitDetail[] = [];

    if (splitType === "equal") {
      const perPerson = totalAmount / editableMembers.length;
      finalSplitDetails = editableMembers.map((name) => ({ travelerName: name, amountOwed: perPerson }));
    } else {
      finalSplitDetails = editableMembers.map((name) => ({ travelerName: name, amountOwed: parseFloat(customSplits[name] || "0") }));
      const manualTotal = finalSplitDetails.reduce((sum, item) => sum + item.amountOwed, 0);
      if (Math.abs(manualTotal - totalAmount) > 0.01) {
        alert("Splits don't match total!");
        setIsSaving(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId: id, description, amount: totalAmount, splitDetails: finalSplitDetails, payer: "You" }),
      });
      if (res.ok) {
  const newExp = await res.json();
  // Fixed "prev" to "expenses"
  setExpenses((prevExpenses) => [newExp, ...prevExpenses]); 
  setDescription(""); 
  setAmount(""); 
  setCustomSplits({});
}
    } finally { setIsSaving(false); }
  };

  const travelerBalances: Record<string, number> = {};
  expenses.forEach(exp => {
    exp.splitDetails?.forEach(split => {
      if (split.travelerName !== "You") {
        travelerBalances[split.travelerName] = (travelerBalances[split.travelerName] || 0) + split.amountOwed;
      }
    });
  });

  if (loading) return <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500" size={48} /></div>;

  return (
    <main className="max-w-6xl mx-auto px-8 py-10 min-h-screen bg-[#0a0a0c] text-white font-sans">
      <div className="flex justify-between items-center mb-10">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-400 font-black uppercase text-xs tracking-widest transition-all group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
        </Link>
        <button onClick={exportToPDF} className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
          <Download size={16} /> Export PDF
        </button>
      </div>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-8 space-y-10">
          <div className="bg-[#16161a] p-10 rounded-[40px] border border-white/5 shadow-2xl">
            <h1 className="text-6xl font-black mb-4 tracking-tighter">{trip?.title}</h1>
            <p className="text-slate-400 flex items-center gap-2 font-bold uppercase text-xs"><MapPin size={16} className="text-indigo-500"/> {trip?.location}</p>
            
            <div className="mt-10 p-8 bg-black/40 rounded-[30px] border border-white/5">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-2"><Users size={16} /> Travelers</h4>
                <div className="flex gap-2">
                   <select 
                    value={trip?.baseCurrency || "$"} 
                    onChange={(e) => setTrip(trip ? {...trip, baseCurrency: e.target.value} : null)}
                    className="bg-black/40 border border-white/10 rounded-xl px-3 text-[10px] font-bold text-white outline-none"
                   >
                     <option value="৳">BDT (৳)</option>
                     <option value="$">USD ($)</option>
                     <option value="€">EUR (€)</option>
                     <option value="£">GBP (£)</option>
                     <option value="₹">INR (₹)</option>
                   </select>
                   <button onClick={handleUpdateNames} disabled={isUpdatingNames} className="text-[10px] bg-indigo-600 px-4 py-2 rounded-xl font-black uppercase flex items-center gap-2 hover:bg-indigo-500">
                    <Save size={14} /> Save Settings
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {editableMembers.map((name, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold">{i + 1}</div>
                    <input type="text" className="bg-transparent border-none outline-none text-sm font-bold w-full" value={name} onChange={(e) => {
                      const newNames = [...editableMembers]; newNames[i] = e.target.value; setEditableMembers(newNames);
                    }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-3xl font-black uppercase flex items-center gap-3"><ReceiptText className="text-indigo-500" size={28} /> Expenses</h3>
            <div className="space-y-4">
              {expenses.map((exp) => (
                <div key={exp._id} className="bg-white p-8 rounded-[40px] flex justify-between items-center group transition-all">
                  <div className="z-10">
                    <p className="font-black text-slate-900 text-2xl tracking-tight">{exp.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {exp.splitDetails.map((s, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-black uppercase">
                          {s.travelerName}: {trip?.baseCurrency}{s.amountOwed.toFixed(2)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 z-10 text-slate-900">
                    <p className="text-4xl font-black tracking-tighter">{trip?.baseCurrency}{exp.amount.toFixed(2)}</p>
                    <button onClick={() => handleDeleteExpense(exp._id)} className="text-slate-300 hover:text-red-500"><Trash2 size={24} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-indigo-600 p-10 rounded-[50px] shadow-2xl border border-indigo-400/20">
            <h3 className="text-xl font-black uppercase tracking-widest mb-8 flex items-center gap-3"><PlusCircle size={24} /> Add Cost</h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 font-bold outline-none placeholder:text-white/40 focus:bg-white/20 transition-all" required />
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black opacity-40">{trip?.baseCurrency}</span>
                <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 pl-12 text-2xl font-black outline-none focus:bg-white/20 transition-all" required />
              </div>
              <div className="flex bg-black/20 p-1 rounded-2xl mt-4">
                <button type="button" onClick={() => setSplitType("equal")} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl ${splitType === 'equal' ? 'bg-white text-indigo-600' : 'text-white/60'}`}>Equal</button>
                <button type="button" onClick={() => setSplitType("custom")} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl ${splitType === 'custom' ? 'bg-white text-indigo-600' : 'text-white/60'}`}>Manual</button>
              </div>
              {splitType === "custom" && (
                <div className="space-y-3 bg-black/20 p-5 rounded-3xl mt-4 max-h-[300px] overflow-y-auto">
                  {editableMembers.map(name => (
                    <div key={name} className="flex justify-between items-center gap-4 bg-white/5 p-3 rounded-xl">
                      <span className="text-[10px] font-black truncate w-28 uppercase text-white/70">{name}</span>
                      <input type="number" step="0.01" value={customSplits[name] || ""} onChange={(e) => setCustomSplits({...customSplits, [name]: e.target.value})} className="w-full bg-transparent border-b border-white/20 text-right outline-none text-sm font-black" placeholder="0.00" />
                    </div>
                  ))}
                </div>
              )}
              <button disabled={isSaving} className="w-full bg-white text-indigo-600 font-black py-5 rounded-[25px] uppercase tracking-[0.2em] text-[10px] mt-4 hover:bg-slate-100 transition-all">
                {isSaving ? "Processing..." : "Confirm Cost"}
              </button>
            </form>
          </div>

          <div className="bg-[#16161a] p-10 rounded-[50px] border border-white/5 shadow-2xl">
            <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter flex items-center gap-3"><Coins className="text-green-500" size={24} /> Settlement</h3>
            <div className="space-y-4">
              {Object.entries(travelerBalances).map(([name, bal]) => {
                const isPaid = trip?.paidMembers?.includes(name);
                return (
                  <div key={name} onClick={() => togglePaidStatus(name)} className={`flex justify-between items-center p-5 rounded-3xl border cursor-pointer transition-all ${isPaid ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/5 hover:border-indigo-500/30'}`}>
                    <div className="flex items-center gap-3">
                      {isPaid ? <CheckCircle2 className="text-green-500" size={18} /> : <div className="w-4 h-4 rounded-full border border-slate-700" />}
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isPaid ? 'text-green-500 line-through opacity-50' : 'text-slate-400'}`}>{name}</span>
                    </div>
                    <span className={`font-black ${isPaid ? 'text-green-500/50' : 'text-green-400'}`}>{trip?.baseCurrency}{bal.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}