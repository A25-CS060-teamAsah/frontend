"use client";
import Link from "next/link";
import { TrendingUp, Users, Clock, CheckCircle, Target, LogOut } from "lucide-react";  // Tambahkan LogOut di import

export default function Sidebar() {
  return (
    <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white h-screen p-6 flex flex-col">
      <h1 className="text-xl font-bold mb-8">LeadScore Portal</h1>
      <nav className="space-y-2">
        <Link href="/dashboard" className="flex items-center gap-3 hover:bg-blue-700 p-3 rounded-lg">
          <TrendingUp /> Dashboard
        </Link>
        <Link href="/leadList" className="flex items-center gap-3 hover:bg-blue-700 p-3 rounded-lg">
          <Users /> Leads
        </Link>
        <Link href="/pending" className="flex items-center gap-3 hover:bg-blue-700 p-3 rounded-lg">
          <Clock /> Pending
        </Link>
      </nav>

      
      <div className="mt-auto p-6 bg-gradient-to-t from-blue-950/50 flex-shrink-0">
        <div className="bg-blue-800/80 rounded-lg p-4 mb-3">
          <p className="text-xs text-blue-200 mb-1">Logged in as</p>
          <p className="font-semibold text-white">Sales Manager</p>
        </div>
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700/50 hover:bg-blue-700 rounded-lg text-white transition-colors">
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
