import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { leads as fallbackLeads } from "@/lib/data";
import { Customer } from "@/lib/types/customer.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Math.max(0, amount));

export const getScoreColor = (score: number) => {
  if (score >= 0.75) return "text-green-600 bg-green-50";
  if (score >= 0.5) return "text-yellow-600 bg-yellow-50";
  return "text-red-600 bg-red-50";
};

export const getScoreBadge = (score: number) => {
  if (score >= 0.75) return { text: "High Priority", color: "bg-green-500" };
  if (score >= 0.5) return { text: "Medium Priority", color: "bg-yellow-500" };
  return { text: "Low Priority", color: "bg-red-500" };
};

export const formatDateTime = (value?: string | Date | null) => {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const broadcastLastUpdated = (date?: string | Date) => {
  const timestamp =
    typeof date === "string" ? date : (date ?? new Date()).toISOString();

  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(
        new CustomEvent("leadscore:lastUpdated", { detail: timestamp }),
      );
      sessionStorage.setItem("leadscore:lastUpdated", timestamp);
    } catch (error) {
      console.error("Failed to broadcast last updated timestamp", error);
    }
  }

  return timestamp;
};

const fallbackNames = fallbackLeads.map((lead) => lead.name);

export const getCustomerDisplayName = (customer: Partial<Customer>) => {
  if (customer.full_name) return customer.full_name;
  if ((customer as { name?: string }).name)
    return (customer as { name?: string }).name as string;

  if (customer.id) {
    return (
      fallbackNames[(customer.id - 1) % fallbackNames.length] ?? "Customer"
    );
  }
  return "Customer";
};

export const getCustomerBalance = (customer: Partial<Customer>) => {
  if (typeof customer.balance === "number") {
    return customer.balance;
  }

  if (customer.id) {
    const index = (customer.id - 1) % fallbackLeads.length;
    return fallbackLeads[index]?.balance ?? 0;
  }

  return 0;
};

export const getScoreValue = (customer?: Partial<Customer>) => {
  if (!customer) return 0;
  if (typeof customer.probability_score === "number") {
    return Math.max(0, Math.min(1, customer.probability_score));
  }

  if ((customer as { score?: number }).score !== undefined) {
    return Math.max(
      0,
      Math.min(1, (customer as { score?: number }).score ?? 0),
    );
  }

  return 0;
};

export const toPercentage = (value: number, digits = 0) =>
  `${(value * 100).toFixed(digits)}%`;
