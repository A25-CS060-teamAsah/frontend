"use client";

import { useState, useEffect } from "react";
import { X, Loader2, TrendingUp, AlertCircle, History, Clock } from "lucide-react";
import { Customer } from "@/lib/types/customer.types";
import { getCustomerPredictionHistory } from "@/lib/api/prediction.service";
import { PredictionHistory } from "@/lib/types/prediction.types";

interface PredictionResponse {
  probability: number;
  willSubscribe: boolean;
  features: Record<string, unknown>;
}

interface LeadDetailModalProps {
  customer: Customer;
  onClose: () => void;
}

export default function LeadDetailModal({
  customer,
  onClose,
}: LeadDetailModalProps) {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "history">("details");
  const [predictionHistory, setPredictionHistory] = useState<PredictionHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrediction();
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer.id]);

  const fetchHistory = async () => {
    try {
      setIsLoadingHistory(true);
      setHistoryError(null);
      const history = await getCustomerPredictionHistory(customer.id);
      setPredictionHistory(history);
    } catch (err) {
      setHistoryError(err instanceof Error ? err.message : "Failed to load history");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const fetchPrediction = async () => {
    // If customer already has a prediction score, use it
    if (customer.probability_score !== null && customer.probability_score !== undefined) {
      setPrediction({
        probability: customer.probability_score,
        willSubscribe: customer.probability_score >= 0.5,
        features: {},
      });
      return;
    }

    // Otherwise, fetch new prediction
    try {
      setIsLoadingPrediction(true);
      setPredictionError(null);

      const { predictSingleCustomer } = await import("@/lib/api/prediction.service");
      const data = await predictSingleCustomer(customer.id);

      setPrediction({
        probability: data.prediction.probability_score,
        willSubscribe: data.prediction.probability_score >= 0.5,
        features: {},
      });
    } catch (err) {
      setPredictionError(
        err instanceof Error ? err.message : "Failed to load prediction"
      );
      setPrediction({
        probability: customer.probability_score ?? 0,
        willSubscribe: (customer.probability_score ?? 0) >= 0.5,
        features: {},
      });
    } finally {
      setIsLoadingPrediction(false);
    }
  };

  const score = prediction?.probability ?? customer.probability_score ?? 0;
  const willSubscribe = prediction?.willSubscribe ?? score >= 0.5;

  const scoreColor = score >= 0.75 ? "green" : score >= 0.5 ? "yellow" : "red";
  const scoreLabel =
    score >= 0.75 ? "High Priority" : score >= 0.5 ? "Medium Priority" : "Low Priority";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900">Lead Details</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50 px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "details"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Details & Prediction
              </div>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "history"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Prediction History ({predictionHistory.length})
              </div>
            </button>
          </div>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-6">
          {activeTab === "details" ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Customer Information
                </h3>
                <div className="space-y-3">
                  <DetailRow
                    label="Full Name"
                    value={customer.full_name || customer.name || `Customer #${customer.id}`}
                  />
                  <DetailRow label="Age" value={`${customer.age} years`} />
                  <DetailRow label="Job" value={customer.job} />
                  <DetailRow label="Marital Status" value={customer.marital} />
                  <DetailRow label="Education" value={customer.education} />
                  <DetailRow
                    label="Balance"
                    value={
                      customer.balance
                        ? `$${customer.balance.toLocaleString()}`
                        : "N/A"
                    }
                  />
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Loan Information
                </h3>
                <div className="space-y-3">
                  <DetailRow
                    label="Has Default"
                    value={customer.has_default ? "Yes" : "No"}
                  />
                  <DetailRow
                    label="Housing Loan"
                    value={customer.has_housing_loan ? "Yes" : "No"}
                  />
                  <DetailRow
                    label="Personal Loan"
                    value={customer.has_personal_loan ? "Yes" : "No"}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <DetailRow label="Contact Type" value={customer.contact} />
                  <DetailRow label="Month" value={customer.month} />
                  <DetailRow label="Day of Week" value={customer.day_of_week} />
                  <DetailRow label="Campaign" value={customer.campaign.toString()} />
                  <DetailRow label="Previous Contacts" value={customer.previous.toString()} />
                  <DetailRow label="Previous Outcome" value={customer.poutcome} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div
                className={`rounded-xl border-2 p-6 ${
                  scoreColor === "green"
                    ? "border-green-500 bg-green-50"
                    : scoreColor === "yellow"
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-red-500 bg-red-50"
                }`}
              >
                <div className="mb-4 flex items-center gap-3">
                  <TrendingUp
                    className={`h-8 w-8 ${
                      scoreColor === "green"
                        ? "text-green-600"
                        : scoreColor === "yellow"
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Prediction Score
                    </h3>
                    <p className="text-sm text-gray-600">
                      Subscription Probability
                    </p>
                  </div>
                </div>

                {isLoadingPrediction ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : predictionError ? (
                  <div className="flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 p-4 text-orange-600">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm">Using cached score</p>
                  </div>
                ) : null}

                <div className="mt-4 text-center">
                  <div
                    className={`text-6xl font-bold ${
                      scoreColor === "green"
                        ? "text-green-600"
                        : scoreColor === "yellow"
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {(score * 100).toFixed(1)}%
                  </div>
                  <p
                    className={`mt-2 text-lg font-semibold ${
                      scoreColor === "green"
                        ? "text-green-700"
                        : scoreColor === "yellow"
                          ? "text-yellow-700"
                          : "text-red-700"
                    }`}
                  >
                    {scoreLabel}
                  </p>
                </div>

                <div className="mt-6 rounded-lg bg-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">
                      Will Subscribe
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        willSubscribe
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {willSubscribe ? "Yes" : "No"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
                  <h4 className="mb-2 font-semibold text-gray-900">
                    Recommendation
                  </h4>
                  <p className="text-sm text-gray-600">
                    {score >= 0.75
                      ? "High priority lead. Recommend immediate follow-up with personalized offer."
                      : score >= 0.5
                        ? "Medium priority. Schedule follow-up call within the next week."
                        : "Low priority. Consider nurturing campaign or alternative products."}
                  </p>
                </div>
              </div>
            </div>
          </div>
          ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Prediction History</h3>
              <button
                onClick={fetchHistory}
                disabled={isLoadingHistory}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Clock className={`h-4 w-4 ${isLoadingHistory ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : historyError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
                <p className="text-red-700 text-sm">{historyError}</p>
              </div>
            ) : predictionHistory.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No prediction history available</p>
                <p className="text-sm text-gray-500 mt-2">
                  This customer has not been predicted yet
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {predictionHistory.map((pred, index) => {
                  const score = pred.probability_score * 100;
                  const scoreColor =
                    score >= 75
                      ? "text-green-600"
                      : score >= 50
                        ? "text-yellow-600"
                        : "text-red-600";
                  const scoreBg =
                    score >= 75
                      ? "bg-green-50 border-green-200"
                      : score >= 50
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-red-50 border-red-200";

                  return (
                    <div
                      key={pred.id}
                      className={`rounded-lg border p-4 ${scoreBg}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`text-3xl font-bold ${scoreColor}`}>
                            {score.toFixed(1)}%
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {(() => {
                                // paksa pembacaan dengan type-safe checking
                                const anyPred = pred as any;

                                const will =
                                  anyPred.will_subscribe ??
                                  anyPred.willSubscribe ??
                                  (typeof anyPred.prediction === "number"
                                    ? anyPred.prediction === 1
                                    : null);

                                return will ? "Will Subscribe" : "Won't Subscribe";
                              })()}
                            </p>
                            <p className="text-xs text-gray-600">
                              Model: {(pred as any).model_version ??
                                      (pred as any).modelVersion ??
                                      (pred as any).version ??
                                      "1.0"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(pred.predicted_at).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric"
                            })}
                          </p>
                          <p className="text-xs text-gray-600">
                            {new Date(pred.predicted_at).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit"
                            })}
                          </p>
                        </div>
                      </div>
                      {index === 0 && (
                        <div className="mt-2">
                          <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-700">
                            Latest
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {predictionHistory.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>ℹ️ Note:</strong> This shows all predictions made for this customer.
                  Scores may change when customer data is updated or model is retrained.
                </p>
              </div>
            )}
          </div>
          )}
        </div>

        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}
