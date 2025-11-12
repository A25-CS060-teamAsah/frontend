"use client";
import { useState } from "react";
import { X, Menu } from "lucide-react";

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="text-right">
          <p className="text-sm text-gray-500">Last Updated</p>
          <p className="text-sm font-semibold text-gray-800">31 Oct 2025, 14:30</p>
        </div>
      </div>
  );
}
