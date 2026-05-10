"use client"; // 1. MUST have this at the very top
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // 2. Import usePathname

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname(); // Tracks what page you are currently on

  useEffect(() => {
    // 🛠️ FIX: Wrap it in an async function to keep the linter happy!
    const checkLoginStatus = async () => {
      const user = localStorage.getItem("user");
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, [pathname]);

  return (
    <nav className="flex justify-between items-center p-6 bg-white shadow-sm">
      {/* Your Logo */}
      <Link href="/" className="font-black text-2xl text-indigo-600">
        TravelApp
      </Link>

      <div className="flex gap-4">
        {/* 4. 🛠️ THE MAGIC: Only show Dashboard if logged in */}
        {isLoggedIn && (
          <Link href="/dashboard" className="font-bold text-slate-700 hover:text-indigo-600">
            Dashboard
          </Link>
        )}

        {/* 5. 🛠️ OPTIONAL: Only show Login/Register if NOT logged in */}
        {!isLoggedIn && (
          <>
            <Link href="/login" className="font-bold text-slate-700 hover:text-indigo-600">
              Sign In
            </Link>
            <Link href="/register" className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-slate-900">
              Create Account
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}