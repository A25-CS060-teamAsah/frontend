"use client";

import { useState, useEffect } from "react";
import { Loader2, Play, Clock, Database, Activity, RefreshCw } from "lucide-react";
import { getJobStatus, getCacheStats, triggerManualPredictJob } from "@/lib/api/prediction.service";
import { JobStatus, CacheStats } from "@/lib/types/prediction.types";
import NotificationModal from "@/components/ui/notification-modal";
import { useNotification } from "@/hooks/useNotification";

export default function AutoPredictMonitor() {
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTriggeringJob, setIsTriggeringJob] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const { notification, showSuccess, showError, closeNotification } = useNotification();

  useEffect(() => {
    loadData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [job, cache] = await Promise.all([
        getJobStatus(),
        getCacheStats()
      ]);

      setJobStatus(job);
      setCacheStats(cache);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualTrigger = async () => {
    try {
      setIsTriggeringJob(true);
      const result = await triggerManualPredictJob();

      // Format user-friendly message
      let message = result.message || "Auto-predict job completed successfully";

      if (result.results) {
        const { total, success, failed } = result.results;

        if (total === 0) {
          message = "All customers already have predictions. No new predictions needed.";
        } else if (success > 0 && failed === 0) {
          message = `Successfully predicted ${success} customer${success > 1 ? 's' : ''}!`;
        } else if (success > 0 && failed > 0) {
          message = `Predicted ${success} customer${success > 1 ? 's' : ''} successfully. ${failed} failed.`;
        } else if (failed > 0) {
          message = `Failed to predict ${failed} customer${failed > 1 ? 's' : ''}.`;
        }
      }

      showSuccess(
        "Auto-Predict Job Triggered",
        message
      );

      // Refresh data after 2 seconds
      setTimeout(() => {
        loadData();
      }, 2000);
    } catch (err) {
      showError(
        "Failed to Trigger Job",
        err instanceof Error ? err.message : "Unknown error occurred while triggering the job"
      );
    } finally {
      setIsTriggeringJob(false);
    }
  };

  const calculateHitRate = (stats: CacheStats | null) => {
    if (!stats || !stats.hits || !stats.misses) return 0;
    const total = stats.hits + stats.misses;
    if (total === 0) return 0;
    return ((stats.hits / total) * 100).toFixed(1);
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  if (isLoading && !jobStatus) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error && !jobStatus) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-700 font-medium">Error loading auto-predict data</p>
        <p className="text-red-600 text-sm mt-2">{error}</p>
        <button
          onClick={loadData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Auto-Predict System Monitor</h2>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {formatDate(lastRefresh.toISOString())}
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Job Status Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Activity className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Cron Job Status</h3>
            <p className="text-sm text-gray-500">Automatic prediction scheduler</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Status</span>
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    jobStatus?.running ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`}
                />
                <span
                  className={`text-sm font-semibold ${
                    jobStatus?.running ? 'text-green-600' : 'text-gray-600'
                  }`}
                >
                  {jobStatus?.running ? 'Running' : 'Idle'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Enabled</span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${jobStatus?.cronEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {jobStatus?.cronEnabled ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">Last Run</span>
            </div>
            <p className="text-sm font-semibold text-gray-900 ml-6">
              {formatDate(jobStatus?.lastRunTime)}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">Next Run</span>
            </div>
            <p className="text-sm font-semibold text-gray-900 ml-6">
              {formatDate(jobStatus?.nextRunTime)}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-600">Schedule</span>
            <p className="text-sm font-semibold text-gray-900 mt-1">
              {jobStatus?.cronSchedule || 'Every 2 minutes'}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-600">Total Runs</span>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              {jobStatus?.totalRuns || 0}
            </p>
          </div>
        </div>

        {/* Manual Trigger Button */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={handleManualTrigger}
            disabled={isTriggeringJob || jobStatus?.isRunning}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isTriggeringJob ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Triggering Job...
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                Trigger Auto-Predict Now
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Manually trigger prediction for customers without scores
          </p>
        </div>
      </div>

      {/* Cache Statistics Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Database className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Cache Performance</h3>
            <p className="text-sm text-gray-500">In-memory prediction cache statistics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-blue-900">Cached Predictions</span>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {cacheStats?.keys || 0}
            </p>
            <p className="text-xs text-blue-700 mt-1">Active cache entries</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <span className="text-sm font-medium text-green-900">Cache Hits</span>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {cacheStats?.hits || 0}
            </p>
            <p className="text-xs text-green-700 mt-1">Served from cache</p>
          </div>

          <div className="p-4 bg-orange-50 rounded-lg">
            <span className="text-sm font-medium text-orange-900">Cache Misses</span>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {cacheStats?.misses || 0}
            </p>
            <p className="text-xs text-orange-700 mt-1">Required ML prediction</p>
          </div>
        </div>

        {/* Hit Rate Display */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">Cache Hit Rate</span>
              <p className="text-xs text-gray-600 mt-1">
                Higher is better (reduces ML API calls)
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-blue-600">
                {calculateHitRate(cacheStats)}%
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${calculateHitRate(cacheStats)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>ℹ️ How it works:</strong> The auto-predict system automatically runs every 2 minutes
          to predict customers without scores. Predictions are cached to reduce redundant ML API calls.
          You can manually trigger predictions at any time using the button above.
        </p>
      </div>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onConfirm={notification.onConfirm}
        autoClose={notification.type === "success"}
        autoCloseDuration={4000}
      />
    </div>
  );
}
