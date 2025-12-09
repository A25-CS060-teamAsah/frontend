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
} from "lucide-react";
import { getPredictionStats } from "@/lib/api/prediction.service";
import { PredictionStats } from "@/lib/types/prediction.types";

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

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-700 font-medium">Error loading analytics</p>
        <p className="text-red-600 text-sm mt-2">{error}</p>
        <button
          onClick={loadStats}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Support both camelCase and snake_case from backend
  const totalPredictions = stats?.totalPredictions || 0;
  const highPriority = stats?.highPriorityCount || 0;
  const mediumPriority = stats?.mediumPriorityCount || 0;
  const lowPriority = stats?.lowPriorityCount || 0;
  // Convert to percentage (backend sends 0.34, display as 34%)
  const avgScore = parseFloat(stats?.averageScore || "0") * 100;
  const customersWithPredictions = stats?.customersWithPredictions || 0;
  const customersWithoutPredictions = stats?.customersWithoutPredictions || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Prediction Analytics
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {lastRefresh.toLocaleString("id-ID")}
          </p>
        </div>
        <button
          onClick={loadStats}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Predictions */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <BarChart3 className="h-6 w-6" />
            </div>
          </div>
          <p className="text-sm font-medium opacity-90">Total Predictions</p>
          <p className="text-4xl font-bold mt-2">
            {totalPredictions.toLocaleString()}
          </p>
          <p className="text-xs opacity-75 mt-2">All-time predictions made</p>
        </div>

        {/* High Priority */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Award className="h-6 w-6" />
            </div>
          </div>
          <p className="text-sm font-medium opacity-90">High Priority</p>
          <p className="text-4xl font-bold mt-2">
            {highPriority.toLocaleString()}
          </p>
          <p className="text-xs opacity-75 mt-2">Score ≥ 75% - Top leads</p>
        </div>

        {/* Medium Priority */}
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Target className="h-6 w-6" />
            </div>
          </div>
          <p className="text-sm font-medium opacity-90">Medium Priority</p>
          <p className="text-4xl font-bold mt-2">
            {mediumPriority.toLocaleString()}
          </p>
          <p className="text-xs opacity-75 mt-2">
            Score 50-75% - Worth pursuing
          </p>
        </div>

        {/* Low Priority */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <p className="text-sm font-medium opacity-90">Low Priority</p>
          <p className="text-4xl font-bold mt-2">
            {lowPriority.toLocaleString()}
          </p>
          <p className="text-xs opacity-75 mt-2">
            Score &lt; 50% - Low conversion
          </p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Average Score */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-xs text-gray-500">
                Overall prediction average
              </p>
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {avgScore.toFixed(1)}%
          </p>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${avgScore}%` }}
            ></div>
          </div>
        </div>

        {/* Customers with Predictions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Predicted Customers
              </p>
              <p className="text-xs text-gray-500">Customers with scores</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {customersWithPredictions.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {customersWithPredictions > 0 && totalPredictions > 0
              ? `${((customersWithPredictions / (customersWithPredictions + customersWithoutPredictions)) * 100).toFixed(1)}% of total customers`
              : "No data"}
          </p>
        </div>

        {/* Pending Predictions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-xs text-gray-500">Awaiting prediction</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-orange-600">
            {customersWithoutPredictions.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {customersWithoutPredictions > 0
              ? "Will be auto-predicted soon"
              : "All customers predicted"}
          </p>
        </div>
      </div>

      {/* Priority Distribution Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Priority Distribution
        </h3>

        <div className="space-y-4">
          {/* High Priority Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                High Priority (≥75%)
              </span>
              <span className="text-sm font-semibold text-green-600">
                {highPriority} (
                {totalPredictions > 0
                  ? ((highPriority / totalPredictions) * 100).toFixed(1)
                  : 0}
                %)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${totalPredictions > 0 ? (highPriority / totalPredictions) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Medium Priority Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Medium Priority (50-75%)
              </span>
              <span className="text-sm font-semibold text-yellow-600">
                {mediumPriority} (
                {totalPredictions > 0
                  ? ((mediumPriority / totalPredictions) * 100).toFixed(1)
                  : 0}
                %)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${totalPredictions > 0 ? (mediumPriority / totalPredictions) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Low Priority Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Low Priority (&lt;50%)
              </span>
              <span className="text-sm font-semibold text-red-600">
                {lowPriority} (
                {totalPredictions > 0
                  ? ((lowPriority / totalPredictions) * 100).toFixed(1)
                  : 0}
                %)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${totalPredictions > 0 ? (lowPriority / totalPredictions) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>ℹ️ About these metrics:</strong> Statistics are updated in
          real-time based on all predictions in the database. High priority
          leads (≥75%) have the highest likelihood of subscribing and should be
          contacted first. The auto-predict system continuously updates scores
          for all customers.
        </p>
      </div>
    </div>
  );
}
