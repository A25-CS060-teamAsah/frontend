"use client";

interface RoleBadgeProps {
  role: "admin" | "sales";
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const styles = {
    admin: "bg-purple-100 text-purple-700 border-purple-200",
    sales: "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${styles[role]}`}
    >
      {role}
    </span>
  );
}
