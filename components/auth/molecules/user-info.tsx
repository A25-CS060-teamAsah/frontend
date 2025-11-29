"use client";

import { useState } from "react";
import { User } from "@/lib/types/auth.types";
import { getCurrentUser } from "@/lib/api/auth.service";
import { RoleBadge } from "../atoms/role-badge";

export function UserInfo() {
  const [user] = useState<User | null>(() => getCurrentUser());

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">{user.email}</p>
        <div className="flex items-center justify-end gap-2 mt-1">
          <RoleBadge role={user.role} />
        </div>
      </div>
      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
        {user.email.charAt(0).toUpperCase()}
      </div>
    </div>
  );
}
