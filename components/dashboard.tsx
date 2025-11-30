"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  ChevronRight,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import { getCustomerStats } from "@/lib/api/customer.service";
import { getTopLeads, getPredictionStats } from "@/lib/api/prediction.service";
import type { Customer, CustomerStats } from "@/lib/types/customer.types";

type TrendItem = {
  month: string;
  total: number;
  highPriority: number;
  avgScore: number;
};



export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [topLeads, setTopLeads] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [avgScore, setAvgScore] = useState<number>(0);
  const [highPriorityCount, setHighPriorityCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [statsData, leadsData, predictionStats] = await Promise.all([
          getCustomerStats(),
          getTopLeads({ limit: 6, threshold: 0.5 }),
          getPredictionStats(),
        ]);

        setStats(statsData);
        setTopLeads(leadsData);
        setAvgScore(parseFloat(predictionStats.averageScore));
        setHighPriorityCount(predictionStats.positivePredictions);

        const now = new Date().toISOString();
        sessionStorage.setItem("leadscore:lastUpdated", now);
        window.dispatchEvent(
          new CustomEvent("leadscore:lastUpdated", { detail: now })
        );
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const trendData = useMemo((): TrendItem[] => {
    if (stats?.monthly_trend?.length) {
      return stats.monthly_trend.map((item) => ({
        month: item.month,
        total: item.total,
        highPriority: item.highPriority ?? Math.round(item.total * 0.25),
        avgScore: item.avgScore ?? 0.7,
      }));
    }
    return [];
  }, [stats]);

  const totalTrend = trendData.map((item) => ({
    month: item.month,
    count: item.total,
  }));
  const highPriorityTrend = trendData.map((item) => ({
    month: item.month,
    count: item.highPriority,
  }));
  const avgScoreTrend = trendData.map((item) => ({
    month: item.month,
    score: item.avgScore,
  }));

  const totalCardValue = (stats as any)?.totalCustomers ?? (stats as any)?.total_customers ?? 0;
  const highPriorityCardValue = highPriorityCount;
  const avgScoreCardValue = avgScore;

  const maxTotal = Math.max(...totalTrend.map((item) => item.count), 1);
  const maxHigh = Math.max(...highPriorityTrend.map((item) => item.count), 1);

  const pendingCalls = (stats as any)?.pendingCalls ?? (stats as any)?.pending_calls ?? 0;
  const monthlyConversions = (stats as any)?.monthlyConversions ?? (stats as any)?.monthly_conversions ?? 0;

  const handleLeadClick = (customerId: number) => {
    router.push(`/leadList?customerId=${customerId}`);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-blue-700">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          <p className="text-sm font-medium">Loading dashboard data...</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Total Leads"
          subtitle="Monthly growth"
          icon={Users}
          accent="from-blue-400 to-blue-600"
          value={`${totalCardValue} Leads`}
          data={totalTrend}
          maxValue={maxTotal}
        />

        <MetricCard
          title="High Priority"
          subtitle="Quality leads"
          icon={Award}
          accent="from-green-400 to-green-600"
          value={`${highPriorityCardValue} Leads`}
          data={highPriorityTrend}
          maxValue={maxHigh}
        />

        <MetricCard
          title="Avg Score"
          subtitle="Score quality trend"
          icon={TrendingUp}
          accent="from-purple-400 to-purple-600"
          value={`${(avgScoreCardValue * 100).toFixed(0)}%`}
          data={avgScoreTrend.map((item) => ({
            month: item.month,
            count: item.score * 100,
          }))}
          maxValue={100}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        <HighlightCard
          icon={Clock}
          bg="from-blue-500 to-blue-600"
          value={pendingCalls}
          label="Pending Leads"
          actionLabel="View All"
          onAction={() => router.push("/leadList")}
        />
        <HighlightCard
          icon={CheckCircle}
          bg="from-green-500 to-green-600"
          value={monthlyConversions}
          label="High Priority"
          actionLabel="View List"
          onAction={() => router.push("/leadList")}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white px-4 sm:px-6 py-4 sm:py-5">
          <h3 className="text-base sm:text-lg font-bold text-gray-800">
            Top Priority Leads
          </h3>
          <p className="text-xs sm:text-sm text-gray-500">
            Customers with highest subscription probability
          </p>
        </div>
        <div className="divide-y divide-gray-100">
          {topLeads.map((lead) => (
            <TopLeadRow
              key={lead.id}
              lead={lead}
              onSelect={() => handleLeadClick(lead.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

type MetricCardProps = {
  title: string;
  subtitle: string;
  value: string;
  icon: typeof Users;
  accent: string;
  data: { month: string; count: number }[];
  maxValue: number;
};

function MetricCard({
  title,
  subtitle,
  value,
  icon: Icon,
  accent,
  data,
  maxValue,
}: MetricCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
      <div className="border-b border-gray-100 bg-gradient-to-r from-slate-50 to-white px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base sm:text-lg font-semibold text-gray-900">{title}</p>
            <p className="text-xs sm:text-sm text-gray-500">{subtitle}</p>
          </div>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
        </div>
      </div>
      <div className="space-y-3 sm:space-y-4 px-4 sm:px-6 py-4 sm:py-5">
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
        <div className="space-y-2">
          {data.map((item) => (
            <div key={item.month} className="flex items-center gap-2 sm:gap-3">
              <span className="w-8 sm:w-10 text-xs font-semibold uppercase text-gray-500">
                {item.month}
              </span>
              <div className="relative h-5 sm:h-6 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`flex h-full items-center justify-end rounded-full bg-gradient-to-r ${accent} pr-2 text-xs font-semibold text-white transition-all`}
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(5, (item.count / maxValue) * 100)
                    )}%`,
                  }}
                >
                  {Math.round(item.count)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type HighlightCardProps = {
  icon: typeof Clock;
  bg: string;
  value: number;
  label: string;
  actionLabel: string;
  onAction: () => void;
};

function HighlightCard({
  icon: Icon,
  bg,
  value,
  label,
  actionLabel,
  onAction,
}: HighlightCardProps) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${bg} px-4 sm:px-6 py-5 sm:py-6 text-white`}>
      <Icon className="mb-3 sm:mb-4 h-8 w-8 sm:h-10 sm:w-10 opacity-80" />
      <p className="text-3xl sm:text-4xl font-bold">{value}</p>
      <p className="text-sm sm:text-base text-white/80">{label}</p>
      <button
        onClick={onAction}
        className="mt-4 sm:mt-6 inline-flex items-center rounded-xl bg-white/20 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold backdrop-blur transition hover:bg-white/30"
      >
        {actionLabel}
      </button>
    </div>
  );
}

type TopLeadRowProps = {
  lead: Customer;
  onSelect: () => void;
};

function TopLeadRow({ lead, onSelect }: TopLeadRowProps) {
  const score = lead.probability_score ?? 0;
  const scoreColor =
    score >= 0.75
      ? "text-green-600"
      : score >= 0.5
        ? "text-yellow-600"
        : "text-red-600";

  // Prioritas: full_name > name > fallback to Customer ID
  const displayName = lead.full_name || lead.name || `Customer #${lead.id}`;
  const displayInfo = `${lead.job} • ${lead.age}y • ${lead.marital}`;

  return (
    <button
      onClick={onSelect}
      className="flex w-full items-center justify-between gap-2 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 text-left transition hover:bg-blue-50/60"
    >
      <div className="flex flex-1 items-center gap-3 sm:gap-4 min-w-0">
        <div className="flex h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-lg sm:text-xl font-bold text-white shadow-md">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm sm:text-base font-semibold text-gray-900">
            {displayName}
          </p>
          <p className="truncate text-xs sm:text-sm text-gray-500">
            {displayInfo}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Score
          </p>
          <p className={`text-xl sm:text-2xl font-bold ${scoreColor}`}>
            {(score * 100).toFixed(0)}%
          </p>
        </div>
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" />
      </div>
    </button>
  );
}
