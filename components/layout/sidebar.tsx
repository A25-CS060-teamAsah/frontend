"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp, Users, UserPlus, LogOut, PanelLeftClose, PanelLeft, Menu, BarChart3, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { logout, getCurrentUser } from "@/lib/api/auth.service";
import { UserProfile } from "@/components/auth/molecules/user-profile";
import { User } from "@/lib/types/auth.types";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: TrendingUp, roles: ["admin", "sales"] },
  { href: "/leadList", label: "Leads", icon: Users, roles: ["admin", "sales"] },
  { href: "/analytics", label: "Analytics", icon: BarChart3, roles: ["admin", "sales"] },
  { href: "/admin", label: "Auto-Predict Monitor", icon: Settings, roles: ["admin", "sales"] },
  { href: "/register", label: "Create New User", icon: UserPlus, roles: ["admin"] },
];

interface SidebarContentProps {
  mobile?: boolean;
  isCollapsed: boolean;
  filteredItems: typeof NAV_ITEMS;
  pathname: string | null;
}

function SidebarContent({ mobile = false, isCollapsed, filteredItems, pathname }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      <div className={cn(
        "pb-6 border-b border-white/10 transition-all duration-300",
        isCollapsed && !mobile ? "text-center mt-16 mb-8" : "mt-14 mb-8"
      )}>
        {!isCollapsed || mobile ? (
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.3em] text-blue-300 font-bold">
              LeadScore
            </p>
            <h1 className="text-3xl font-bold text-white tracking-tight">Portal</h1>
            <p className="text-xs text-blue-200 mt-2">Lead Management System</p>
          </div>
        ) : (
          <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-xl font-bold text-white">LS</span>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1.5">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-200",
                isActive
                  ? "bg-white text-[#0E2A7D] shadow-lg shadow-white/20"
                  : "text-blue-100 hover:bg-white/10 hover:text-white hover:translate-x-1",
                isCollapsed && !mobile && "justify-center px-2"
              )}
              title={isCollapsed && !mobile ? item.label : undefined}
            >
              <Icon className={cn(
                "flex-shrink-0 transition-transform duration-200",
                isActive ? "w-5 h-5" : "w-5 h-5 group-hover:scale-110"
              )} />
              {(!isCollapsed || mobile) && (
                <span className="truncate">{item.label}</span>
              )}
              {isActive && (!isCollapsed || mobile) && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0E2A7D]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/10 space-y-3">
        {(!isCollapsed || mobile) && (
          <div className="mb-4">
            <UserProfile />
          </div>
        )}
        <Button
          onClick={logout}
          variant="ghost"
          className={cn(
            "w-full justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-white hover:text-white border border-red-500/20 hover:border-red-500/40 transition-all duration-200 font-semibold",
            isCollapsed && !mobile && "px-2"
          )}
        >
          <LogOut className="w-4 h-4" />
          {(!isCollapsed || mobile) && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const [user] = useState<User | null>(() => getCurrentUser());

  const filteredItems = NAV_ITEMS.filter(item => !user || item.roles.includes(user.role));

  useEffect(() => {
    const handleRouteChange = () => {
      if (open) {
        setOpen(false);
      }
    };
    handleRouteChange();
  }, [pathname, open]);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50 bg-gradient-to-br from-[#0E2A7D] to-[#1a3a9d] text-white hover:from-[#1a3a9d] hover:to-[#0E2A7D] hover:text-white shadow-xl border-2 border-white/20"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 bg-gradient-to-b from-[#0E2A7D] to-[#1a3a9d] text-white border-r-2 border-white/10 p-6">
          <SidebarContent mobile isCollapsed={false} filteredItems={filteredItems} pathname={pathname} />
        </SheetContent>
      </Sheet>

      <aside className={cn(
        "hidden lg:flex bg-gradient-to-b from-[#0E2A7D] via-[#0E2A7D] to-[#1a3a9d] text-white h-screen flex-col transition-all duration-300 relative shadow-2xl border-r border-white/5",
        isCollapsed ? "w-20 p-4" : "w-72 p-6"
      )}>
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "absolute top-2 z-10 bg-white/10 hover:bg-white/20 text-white hover:text-white backdrop-blur-sm transition-all duration-200",
              isCollapsed ? "right-2 h-8 w-8 p-0" : "right-2 h-8 px-3"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <PanelLeft className="w-4 h-4" />
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4 mr-2" />
                <span className="text-xs font-medium">Collapse</span>
              </>
            )}
          </Button>
        </div>

        <SidebarContent isCollapsed={isCollapsed} filteredItems={filteredItems} pathname={pathname} />
      </aside>
    </>
  );
}