"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  TrendingUp,
  Award,
  Target,
  BarChart3,
  Users,
  Calendar,
  RefreshCw,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  PieChart,
  Activity,
} from "lucide-react";
import { getPredictionStats } from "@/lib/api/prediction.service";
import { PredictionStats } from "@/lib/types/prediction.types";

// Animated counter hook
function useAnimatedCounter(end: number, duration: number = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
}

// Donut Chart Component
function DonutChart({ 
  high, 
  medium, 
  low, 
  total 
}: { 
  high: number; 
  medium: number; 
  low: number; 
  total: number;
}) {
  const radius = 80;
  const strokeWidth = 24;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const highPercent = total > 0 ? (high / total) * 100 : 0;
  const mediumPercent = total > 0 ? (medium / total) * 100 : 0;
  const lowPercent = total > 0 ? (low / total) * 100 : 0;

  const highOffset = circumference - (highPercent / 100) * circumference;
  const mediumOffset = circumference - (mediumPercent / 100) * circumference;
  const lowOffset = circumference - (lowPercent / 100) * circumference;

  const highRotation = 0;
  const mediumRotation = highPercent * 3.6;
  const lowRotation = (highPercent + mediumPercent) * 3.6;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Low Priority (Red) - Bottom layer */}
        <circle
          stroke="url(#redGradient)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ 
            strokeDashoffset: lowOffset,
            transform: `rotate(${lowRotation}deg)`,
            transformOrigin: '50% 50%',
            transition: 'stroke-dashoffset 1s ease-out'
          }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Medium Priority (Yellow) */}
        <circle
          stroke="url(#yellowGradient)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ 
            strokeDashoffset: mediumOffset,
            transform: `rotate(${mediumRotation}deg)`,
            transformOrigin: '50% 50%',
            transition: 'stroke-dashoffset 1s ease-out'
          }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* High Priority (Green) - Top layer */}
        <circle
          stroke="url(#greenGradient)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ 
            strokeDashoffset: highOffset,
            transform: `rotate(${highRotation}deg)`,
            transformOrigin: '50% 50%',
            transition: 'stroke-dashoffset 1s ease-out'
          }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Gradients */}
        <defs>
          <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
          <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
          <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-800">{total}</span>
        <span className="text-xs text-gray-500 font-medium">Total Leads</span>
      </div>
    </div>
  );
}

// Score Gauge Component
function ScoreGauge({ score }: { score: number }) {
  const rotation = (score / 100) * 180 - 90;
  
  return (
    <div className="relative w-48 h-24 overflow-hidden">
      {/* Background arc */}
      <div className="absolute inset-0">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          {/* Background track */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Colored arc */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 251.2} 251.2`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
      </div>
      {/* Needle */}
      <div 
        className="absolute bottom-0 left-1/2 w-1 h-16 bg-linear-to-t from-gray-800 to-gray-600 origin-bottom transition-transform duration-1000 ease-out rounded-full"
        style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
      />
      {/* Center dot */}
      <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-gray-800 rounded-full transform -translate-x-1/2 translate-y-1/2 shadow-lg" />
      {/* Score label */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <span className="text-2xl font-bold bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          {score.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  gradient, 
  trend,
  delay = 0 
}: { 
  icon: React.ElementType;
  title: string;
  value: number;
  subtitle: string;
  gradient: string;
  trend?: 'up' | 'down' | null;
  delay?: number;
}) {
  const animatedValue = useAnimatedCounter(value, 1200);
  
  return (
    <div 
      className={`relative overflow-hidden rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-2xl ${gradient}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Icon className="h-6 w-6" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              trend === 'up' ? 'bg-white/20' : 'bg-white/10'
            }`}>
              {trend === 'up' ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              <span>{trend === 'up' ? '+5%' : '-2%'}</span>
            </div>
          )}
        </div>
        <p className="text-sm font-medium opacity-90 mb-1">{title}</p>
        <p className="text-4xl font-bold tracking-tight">
          {animatedValue.toLocaleString()}
        </p>
        <p className="text-xs opacity-75 mt-2 flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default function PredictionAnalytics() {
  const [stats, setStats] = useState<PredictionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getPredictionStats();
      setStats(data);
      setLastRefresh(new Date());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load statistics",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Support both camelCase and snake_case from backend
  const totalPredictions = stats?.totalPredictions || 0;
  const highPriority = stats?.highPriorityCount || 0;
  const mediumPriority = stats?.mediumPriorityCount || 0;
  const lowPriority = stats?.lowPriorityCount || 0;
  const avgScore = parseFloat(stats?.averageScore || "0") * 100;
  const customersWithPredictions = stats?.customersWithPredictions || 0;
  const customersWithoutPredictions = stats?.customersWithoutPredictions || 0;
  const totalCustomers = customersWithPredictions + customersWithoutPredictions;
  const predictedPercent = totalCustomers > 0 
    ? ((customersWithPredictions / totalCustomers) * 100).toFixed(1) 
    : "0";

  if (isLoading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
        <p className="text-gray-500 font-medium animate-pulse">Loading analytics...</p>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="rounded-2xl border border-red-200 bg-linear-to-br from-red-50 to-red-100 p-8 text-center shadow-lg">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="h-8 w-8 text-red-500" />
        </div>
        <p className="text-red-700 font-semibold text-lg">Error loading analytics</p>
        <p className="text-red-600 text-sm mt-2 mb-6">{error}</p>
        <button
          onClick={loadStats}
          className="px-6 py-3 bg-linear-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Prediction Analytics
            </h2>
          </div>
          <p className="text-gray-500 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Last updated: {lastRefresh.toLocaleString("id-ID")}
          </p>
        </div>
        <button
          onClick={loadStats}
          disabled={isLoading}
          className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <RefreshCw className={`h-4 w-4 transition-transform duration-500 ${isLoading ? "animate-spin" : "group-hover:rotate-180"}`} />
          <span className="font-medium">Refresh</span>
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={BarChart3}
          title="Total Predictions"
          value={totalPredictions}
          subtitle="All-time predictions made"
          gradient="bg-linear-to-br from-blue-500 via-blue-600 to-indigo-600"
          delay={0}
        />
        <StatCard
          icon={Award}
          title="High Priority"
          value={highPriority}
          subtitle="Score ≥ 75% - Top leads"
          gradient="bg-linear-to-br from-emerald-500 via-green-500 to-teal-600"
          trend="up"
          delay={100}
        />
        <StatCard
          icon={Target}
          title="Medium Priority"
          value={mediumPriority}
          subtitle="Score 50-75% - Worth pursuing"
          gradient="bg-linear-to-br from-amber-500 via-yellow-500 to-orange-500"
          delay={200}
        />
        <StatCard
          icon={TrendingUp}
          title="Low Priority"
          value={lowPriority}
          subtitle="Score < 50% - Low conversion"
          gradient="bg-linear-to-br from-rose-500 via-red-500 to-pink-600"
          trend="down"
          delay={300}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-linear-to-br from-violet-100 to-purple-100 rounded-xl">
              <PieChart className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Lead Distribution</h3>
              <p className="text-sm text-gray-500">Priority breakdown</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <DonutChart 
              high={highPriority} 
              medium={mediumPriority} 
              low={lowPriority} 
              total={totalPredictions} 
            />
            
            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-linear-to-r from-green-500 to-green-600" />
                <span className="text-sm text-gray-600">High ({highPriority})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-linear-to-r from-yellow-500 to-yellow-600" />
                <span className="text-sm text-gray-600">Medium ({mediumPriority})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-linear-to-r from-red-500 to-red-600" />
                <span className="text-sm text-gray-600">Low ({lowPriority})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Average Score Gauge Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-linear-to-br from-indigo-100 to-blue-100 rounded-xl">
              <Zap className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Average Score</h3>
              <p className="text-sm text-gray-500">Overall prediction performance</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center pt-4">
            <ScoreGauge score={avgScore} />
            
            <div className="mt-12 w-full">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
              <div className="h-2 bg-linear-to-r from-red-400 via-yellow-400 to-green-400 rounded-full" />
            </div>
            
            <p className="text-sm text-gray-500 mt-4 text-center">
              {avgScore >= 70 ? "🎯 Excellent prediction accuracy!" : 
               avgScore >= 50 ? "📊 Good performance, room for improvement" : 
               "⚠️ Consider refining your lead sources"}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Predicted Customers */}
        <div className="bg-linear-to-br from-white to-blue-50 rounded-2xl border border-blue-100 shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-linear-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Predicted</p>
              <p className="text-xs text-gray-500">With scores</p>
            </div>
          </div>
          <p className="text-4xl font-bold text-blue-600 mb-2">
            {customersWithPredictions.toLocaleString()}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-blue-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000"
                style={{ width: `${predictedPercent}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-blue-600">{predictedPercent}%</span>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-linear-to-br from-white to-amber-50 rounded-2xl border border-amber-100 shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-linear-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-xs text-gray-500">Awaiting prediction</p>
            </div>
          </div>
          <p className="text-4xl font-bold text-amber-600 mb-2">
            {customersWithoutPredictions.toLocaleString()}
          </p>
          <p className="text-sm text-amber-600 flex items-center gap-1">
            {customersWithoutPredictions > 0 ? (
              <>
                <RefreshCw className="h-3 w-3 animate-spin" />
                Auto-predicting soon...
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3" />
                All customers predicted! 🎉
              </>
            )}
          </p>
        </div>

        {/* Conversion Rate */}
        <div className="bg-linear-to-br from-white to-emerald-50 rounded-2xl border border-emerald-100 shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority Rate</p>
              <p className="text-xs text-gray-500">Top leads ratio</p>
            </div>
          </div>
          <p className="text-4xl font-bold text-emerald-600 mb-2">
            {totalPredictions > 0 ? ((highPriority / totalPredictions) * 100).toFixed(1) : 0}%
          </p>
          <p className="text-sm text-emerald-600 flex items-center gap-1">
            <Award className="h-3 w-3" />
            {highPriority} high-value leads identified
          </p>
        </div>
      </div>

      {/* Priority Distribution Bars */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-linear-to-br from-gray-100 to-gray-200 rounded-xl">
            <BarChart3 className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Priority Breakdown</h3>
            <p className="text-sm text-gray-500">Detailed distribution analysis</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* High Priority Bar */}
          <div className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-gray-700">High Priority</span>
                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">≥75%</span>
              </div>
              <span className="text-sm font-bold text-green-600">
                {highPriority.toLocaleString()} ({totalPredictions > 0 ? ((highPriority / totalPredictions) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className="bg-linear-to-r from-green-400 via-green-500 to-emerald-500 h-4 rounded-full transition-all duration-1000 ease-out relative group-hover:shadow-lg"
                style={{ width: `${totalPredictions > 0 ? (highPriority / totalPredictions) * 100 : 0}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Medium Priority Bar */}
          <div className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="text-sm font-medium text-gray-700">Medium Priority</span>
                <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">50-75%</span>
              </div>
              <span className="text-sm font-bold text-yellow-600">
                {mediumPriority.toLocaleString()} ({totalPredictions > 0 ? ((mediumPriority / totalPredictions) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className="bg-linear-to-r from-yellow-400 via-amber-500 to-orange-400 h-4 rounded-full transition-all duration-1000 ease-out relative group-hover:shadow-lg"
                style={{ width: `${totalPredictions > 0 ? (mediumPriority / totalPredictions) * 100 : 0}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Low Priority Bar */}
          <div className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-sm font-medium text-gray-700">Low Priority</span>
                <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">&lt;50%</span>
              </div>
              <span className="text-sm font-bold text-red-600">
                {lowPriority.toLocaleString()} ({totalPredictions > 0 ? ((lowPriority / totalPredictions) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className="bg-linear-to-r from-red-400 via-rose-500 to-pink-500 h-4 rounded-full transition-all duration-1000 ease-out relative group-hover:shadow-lg"
                style={{ width: `${totalPredictions > 0 ? (lowPriority / totalPredictions) * 100 : 0}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-linear-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <Sparkles className="h-6 w-6 text-indigo-500" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">💡 Pro Tips</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              <strong>High priority leads (≥75%)</strong> have the highest likelihood of subscribing — contact them first! 
              The auto-predict system continuously updates scores for all customers. 
              Focus your marketing efforts on high and medium priority segments for maximum ROI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
