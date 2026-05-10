import Link from "next/link";
import { Plane, Users, Receipt, Sparkles, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center bg-white min-h-screen">
      {/* --- STICKY NAVIGATION --- */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-200">
              T
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">TravelFlow</span>
          </div>
          
          <nav className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition">
              Sign In
            </Link>
            <Link href="/signup" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 transition shadow-xl shadow-blue-50">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative w-full pt-40 pb-24 px-6 text-center overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-blue-100/40 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[30%] bg-indigo-100/40 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-black uppercase tracking-widest mb-8">
            <Sparkles size={14} /> The ultimate group travel tool
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
            Travel together, <br />
            <span className="text-blue-600">split fairly.</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Manage itineraries, track shared expenses, and settle balances 
            without the <span className="text-slate-900 font-bold">who-owes-what</span> headache.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup" className="group bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all duration-300 shadow-xl shadow-blue-100 flex items-center gap-2">
              Get Started for Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="px-10 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all border border-slate-200">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="max-w-7xl w-full py-24 px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Plane size={24} />} 
            title="Trip Planning" 
            desc="Create packages, set destinations, and invite your friends in seconds." 
          />
          <FeatureCard 
            icon={<Receipt size={24} />} 
            title="Expense Tracking" 
            desc="Log dinners, flights, and tours. Categorize everything easily." 
          />
          <FeatureCard 
            icon={<Users size={24} />} 
            title="Smart Splits" 
            desc="Our algorithm calculates exactly who owes what to simplify settling up." 
          />
        </div>
      </section>

      {/* --- TRUST LOGOS --- */}
      <section className="w-full py-20 bg-slate-50/50 border-y border-slate-100 flex flex-col items-center">
        <p className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] mb-8">Trusted by explorers worldwide</p>
        <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale font-bold text-2xl text-slate-400 italic">
          <span>TRAVLR</span>
          <span>WANDER</span>
          <span>GLOBE</span>
          <span>NOMAD</span>
        </div>
      </section>
    </div>
  );
}

// --- FEATURE CARD COMPONENT ---
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
    <div className="group p-10 bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-50/50 hover:-translate-y-2 transition-all duration-500">
      <div className="w-16 h-16 bg-blue-50 rounded-[24px] flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500 text-blue-600">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-slate-900 tracking-tight">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}