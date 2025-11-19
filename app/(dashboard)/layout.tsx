"use client";

import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { AuthGuard } from "@/components/auth/auth-guard";
import "../globals.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}


