"use client";

import { useState, useEffect } from "react";
import {
  Award,
  Clock,
  Phone,
  MessageCircle,
  Mail,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { getCustomers } from "@/lib/api/customer.service";
import { Customer } from "@/lib/types/customer.types";

export default function Pending() {
  const [showContactOptions, setShowContactOptions] = useState<number | null>(
    null,
  );
  const [pendingLeads, setPendingLeads] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingLeads();
  }, []);

  const fetchPendingLeads = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch customers without predictions (prediction_score is null)
      const response = await getCustomers({
        limit: 100,
        sortBy: "created_at",
        order: "DESC",
      });

      // Filter customers without prediction scores
      const pending = response.customers.filter(
        (customer) =>
          customer.probability_score === null ||
          customer.probability_score === undefined,
      );

      setPendingLeads(pending);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load pending leads",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700 font-medium">Error loading pending leads</p>
        <p className="text-red-600 text-sm mt-2">{error}</p>
        <button
          onClick={fetchPendingLeads}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const totalPending = pendingLeads.length;

  return (
    <div className="space-y-6">
      {/* Stat Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Pending</p>
              <p className="text-3xl font-bold text-blue-600">{totalPending}</p>
            </div>
            <Clock className="w-10 h-10 text-blue-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Customers without predictions
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Needs Review</p>
              <p className="text-3xl font-bold text-orange-600">
                {totalPending}
              </p>
            </div>
            <Award className="w-10 h-10 text-orange-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Awaiting ML prediction</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Auto-Predict</p>
              <p className="text-3xl font-bold text-purple-600">Active</p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Runs every 2 minutes</p>
        </div>
      </div>

      {/* Pending Calls List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">
            Pending Predictions
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Customers awaiting ML prediction scores
          </p>
        </div>

        {totalPending === 0 ? (
          <div className="px-6 py-12 text-center">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              No Pending Predictions
            </h4>
            <p className="text-gray-500">All customers have been predicted!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Job
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Education
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingLeads.map((lead) => {
                  // Prioritas: full_name > name > fallback to Customer ID
                  const displayName =
                    lead.full_name || lead.name || `Customer #${lead.id}`;
                  const initial = displayName.charAt(0).toUpperCase();

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {initial}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {displayName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {lead.marital}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-800">
                          {lead.age} years
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-800">{lead.job}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {lead.education}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowContactOptions(
                                showContactOptions === lead.id ? null : lead.id,
                              )
                            }
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                          >
                            <Phone className="w-4 h-4" />
                            Contact
                          </button>

                          {showContactOptions === lead.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                              <button className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 border-b border-gray-100">
                                <Phone className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-gray-700">
                                  Call Now
                                </span>
                              </button>
                              <button className="w-full px-4 py-3 text-left hover:bg-green-50 transition-colors flex items-center gap-3 border-b border-gray-100">
                                <MessageCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-gray-700">
                                  WhatsApp
                                </span>
                              </button>
                              <button className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors flex items-center gap-3">
                                <Mail className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-medium text-gray-700">
                                  Email
                                </span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
