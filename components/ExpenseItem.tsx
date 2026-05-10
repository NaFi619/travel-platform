import { Banknote, User, Calendar } from "lucide-react";

interface ExpenseProps {
  description: string;
  amount: number;
  payer: string;
  date: string;
  category?: string;
}

export default function ExpenseItem({ description, amount, payer, date, category }: ExpenseProps) {
  return (
    <div className="group bg-white border border-slate-200 p-5 rounded-[24px] hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300 flex items-center justify-between">
      <div className="flex items-center gap-5">
        {/* Category Icon Box */}
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <Banknote size={26} />
        </div>

        {/* Text Details - High Visibility */}
        <div>
          <h4 className="text-lg font-black text-slate-900 leading-tight">
            {description}
          </h4>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-slate-700 font-bold text-xs">
              <User size={14} className="text-indigo-500" />
              {payer}
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-slate-500 font-medium text-xs">
              <Calendar size={14} />
              {date}
            </span>
          </div>
        </div>
      </div>

      {/* Amount - Sharp Contrast */}
      <div className="text-right">
        <div className="text-xl font-black text-slate-900">
          ${amount.toFixed(2)}
        </div>
        {category && (
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
            {category}
          </span>
        )}
      </div>
    </div>
  );
}