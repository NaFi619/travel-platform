import "./globals.css";
import Link from "next/link"; // ✅ Correctly imported
import { Plus_Jakarta_Sans } from "next/font/google";


const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${jakarta.className} bg-[#FAFAFB] text-slate-900 antialiased`}>
        
        {/* Subtle Mesh Gradient Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px]" />
          <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-100/40 blur-[120px]" />
        </div>

        <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200/60 px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-xs">TF</span>
              </div>
              <h1 className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                TravelFlow
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
            {/* 🔗 Dynamic Navigation Links */}
            <Link href="/support" className="hover:text-indigo-600 transition">Support</Link>
            
            <Link href="/login" className="hover:text-indigo-600 transition font-bold">
              Login
            </Link>

            <Link href="/dashboard" className="bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-indigo-600 transition shadow-sm font-bold active:scale-95">
              Dashboard
            </Link>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}