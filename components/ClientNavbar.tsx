"use client"; // 👈 Crucial: This tells Next.js this file is for the browser

import dynamic from 'next/dynamic';

// We move the dynamic logic here
const Navbar = dynamic(() => import('./Navbar'), { 
  ssr: false, 
  loading: () => <div className="h-20 bg-white border-b border-slate-100" /> 
});

export default function ClientNavbar() {
  return <Navbar />;
}