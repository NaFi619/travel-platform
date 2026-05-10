import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TravelFlow | Plan Together",
  description: "Split expenses and manage trips with friends",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <nav className="border-b bg-white px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">TravelFlow</h1>
        </nav>
        {children}
      </body>
    </html>
  );
}