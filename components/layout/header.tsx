"use client";

import { useEffect, useState } from "react";
import { formatDateTime } from "@/lib/utils";
import { UserInfo } from "@/components/auth/molecules/user-info";

export default function Header() {
  const [lastUpdated, setLastUpdated] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("leadscore:lastUpdated") || "";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setLastUpdated(customEvent.detail);
    };

    window.addEventListener("leadscore:lastUpdated", handler);

    return () => window.removeEventListener("leadscore:lastUpdated", handler);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
      <div className="flex-1 lg:ml-0 ml-12" />
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="text-right border-r border-gray-200 pr-3 sm:pr-6 hidden sm:block">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Last Updated
          </p>
          <p className="text-sm font-semibold text-gray-800">
            {lastUpdated ? formatDateTime(lastUpdated) : "—"}
          </p>
        </div>
        <UserInfo />
      </div>
    </header>
  );
}
