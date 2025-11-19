"use client";

import { useEffect, useState } from "react";
import { User } from "@/lib/types/auth.types";
import { getCurrentUser, getMe } from "@/lib/api/auth.service";
import { RoleBadge } from "@/components/auth/atoms/role-badge";
import { User as UserIcon } from "lucide-react";

export function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const cachedUser = getCurrentUser();
      if (cachedUser) {
        setUser(cachedUser);
      }

      const freshUser = await getMe();
      if (freshUser) {
        setUser(freshUser);
      }
      
      setIsLoading(false);
    };

    loadUser();
  }, []);

  if (isLoading || !user) {
    return (
      <div className="rounded-2xl bg-white/10 px-4 py-5 text-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-full bg-white/20" />
          <div className="flex-1">
            <div className="mb-1 h-3 w-20 animate-pulse rounded bg-white/20" />
            <div className="h-4 w-32 animate-pulse rounded bg-white/20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white/10 px-4 py-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
          <UserIcon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-blue-200">Logged in as</p>
          <p className="font-semibold text-white truncate text-sm">{user.email}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-blue-200">Role:</span>
        <RoleBadge role={user.role} />
      </div>
    </div>
  );
}
