import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);

export const getScoreColor = (score: number) => {
  if (score >= 0.75) return 'text-green-600 bg-green-50';
  if (score >= 0.5) return 'text-yellow-600 bg-yellow-50';
  return 'text-red-600 bg-red-50';
};

export const getScoreBadge = (score: number) => {
  if (score >= 0.75) return { text: 'High Priority', color: 'bg-green-500' };
  if (score >= 0.5) return { text: 'Medium Priority', color: 'bg-yellow-500' };
  return { text: 'Low Priority', color: 'bg-red-500' };
};
