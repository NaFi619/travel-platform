"use client";
import { useState, useEffect } from "react";
import { Plus, Receipt, Loader2, X, Trash2, DollarSign, Calendar, Tag } from "lucide-react";

interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);

  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const loadExpenses = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        window.location.href = "/login";
        return;
      }
      
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      setLoading(true);
      try {
        const res = await fetch(`/api/expenses?userId=${parsedUser.id}&t=${Date.now()}`, {
          cache: "no-store"
        });
        if (res.ok) {
          const data = await res.json();
          setExpenses(data);
        }
      } catch (e) {
        console.error("Failed to load expenses", e);
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, []);

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newExpense,
          amount: Number(newExpense.amount),
          userId: user.id,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setExpenses((prev) => [created, ...prev]);
        setShowModal(false);
        setNewExpense({ title: "", amount: "", category: "Food", date: new Date().toISOString().split("T")[0] });
      }
    } catch (err) {
      alert("Error saving expense");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Delete this expense?")) return;
    try {
      const res = await fetch(`/api/expenses?id=${id}`, { method: "DELETE" });
      if (res.ok) setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (err) { console.error(err); }
  };

  const totalSpent = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  return (
    <main className="max-w-7xl mx-auto px-8 py-12 min-h-screen bg-[#f8fafc]">
      <header className="flex justify-between items-end mb-12 border-b-2 border-slate-200 pb-6">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tight">Expenses</h2>
          <p className="text-slate-600 mt-3 text-lg font-bold uppercase tracking-widest text-emerald-500">
            Total Spent: ৳{totalSpent.toLocaleString()}
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black hover:bg-slate-900 transition-all shadow-xl active:scale-95">
          <Plus size={20} strokeWidth={3} /> Add Expense
        </button>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4"><Loader2 className="animate-spin text-emerald-500" size={48} /><p className="font-black">Loading Expenses...</p></div>
      ) : (
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
          {expenses.length === 0 ? (
            <div className="text-center py-10 text-slate-400 font-bold">No expenses logged yet. Add one to start tracking!</div>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div key={expense._id} className="flex items-center justify-between p-5 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 group">
                  <div className="flex items-center gap-5">
                    <div className="bg-emerald-100 text-emerald-600 p-4 rounded-2xl"><Receipt size={24} /></div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">{expense.title}</h3>
                      <div className="flex gap-3 text-sm font-bold text-slate-400 mt-1">
                        <span className="flex items-center gap-1"><Tag size={14} /> {expense.category}</span>
                        <span className="flex items-center gap-1"><Calendar size={14} /> {expense.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-2xl font-black text-slate-900">৳{expense.amount.toLocaleString()}</span>
                    <button onClick={() => handleDeleteExpense(expense._id)} className="text-slate-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={20} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* NEW EXPENSE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[48px] p-12 relative shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900"><X size={32} /></button>
            <form onSubmit={handleCreateExpense} className="space-y-6 text-slate-900">
              <h3 className="text-3xl font-black text-center uppercase mb-8">Add Expense</h3>
              
              <input placeholder="What did you buy?" className="w-full bg-slate-100 rounded-2xl p-5 font-bold outline-none border-2 border-transparent focus:border-emerald-500 transition-all" required value={newExpense.title} onChange={(e) => setNewExpense({...newExpense, title: e.target.value})} />
              
              <div className="relative">
                <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="number" placeholder="Amount (৳)" className="w-full bg-slate-100 rounded-2xl p-5 pl-12 font-bold outline-none border-2 border-transparent focus:border-emerald-500 transition-all" required value={newExpense.amount} onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})} />
              </div>

              <select className="w-full bg-slate-100 rounded-2xl p-5 font-bold outline-none border-2 border-transparent focus:border-emerald-500 transition-all appearance-none" value={newExpense.category} onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}>
                <option value="Food">🍔 Food & Dining</option>
                <option value="Transport">🚕 Transportation</option>
                <option value="Accommodation">🏨 Accommodation</option>
                <option value="Activities">🎟️ Activities</option>
                <option value="Other">🛍️ Other</option>
              </select>

              <input type="date" className="w-full bg-slate-100 rounded-2xl p-5 font-bold outline-none border-2 border-transparent focus:border-emerald-500 transition-all" required value={newExpense.date} onChange={(e) => setNewExpense({...newExpense, date: e.target.value})} />
              
              <button disabled={saving} className="w-full bg-emerald-500 text-white font-black text-xl py-6 rounded-[28px] hover:bg-slate-900 transition-all flex justify-center items-center shadow-xl">
                {saving ? <Loader2 className="animate-spin" /> : "Save Expense"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}