"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Loader2,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Upload,
  Zap,
  Filter,
  X,
} from "lucide-react";
import { getCustomers, deleteCustomer } from "@/lib/api/customer.service";
import { predictBatchCustomers } from "@/lib/api/prediction.service";
import { Customer } from "@/lib/types/customer.types";
import LeadDetailModal from "./organisms/lead-detail-modal";
import CustomerFormModal from "./organisms/customer-form-modal";
import CSVUploadModal from "./organisms/csv-upload-modal";
import NotificationModal from "@/components/ui/notification-modal";
import { useNotification } from "@/hooks/useNotification";

const formatCurrency = (amount?: number | null) => {
  if (!amount) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export default function Leads() {
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState<Customer[]>([]);
  const [selectedLead, setSelectedLead] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [isBatchPredicting, setIsBatchPredicting] = useState(false);
  const {
    notification,
    showSuccess,
    showError,
    showConfirm,
    closeNotification,
  } = useNotification();

  // Advanced Filter States
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [job, setJob] = useState("");
  const [education, setEducation] = useState("");
  const [marital, setMarital] = useState("");
  const [housing, setHousing] = useState<boolean | undefined>(undefined);
  const [loan, setLoan] = useState<boolean | undefined>(undefined);
  const [hasDefault, setHasDefault] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const customerId = searchParams.get("customerId");
    if (customerId) {
      fetchLeadById(parseInt(customerId));
    }
  }, [searchParams]);

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    searchQuery,
    scoreFilter,
    minAge,
    maxAge,
    job,
    education,
    marital,
    housing,
    loan,
    hasDefault,
  ]);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getCustomers({
        page,
        limit: 20,
        search: searchQuery || undefined,
        sortBy: "probability_score",
        order: "DESC",
        minAge: minAge ? parseInt(minAge) : undefined,
        maxAge: maxAge ? parseInt(maxAge) : undefined,
        job: job || undefined,
        education: education || undefined,
        marital: marital || undefined,
        housing: housing,
        loan: loan,
        hasDefault: hasDefault,
      });

      setLeads(response.customers);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads");
    } finally {
      setIsLoading(false);
    }
  };

  const clearAdvancedFilters = () => {
    setMinAge("");
    setMaxAge("");
    setJob("");
    setEducation("");
    setMarital("");
    setHousing(undefined);
    setLoan(undefined);
    setHasDefault(undefined);
    setPage(1);
  };

  const hasActiveFilters = () => {
    return (
      minAge ||
      maxAge ||
      job ||
      education ||
      marital ||
      housing !== undefined ||
      loan !== undefined ||
      hasDefault !== undefined
    );
  };

  const fetchLeadById = async (id: number) => {
    try {
      const allLeads = await getCustomers({ limit: 1000 });
      const lead = allLeads.customers.find((l) => l.id === id);
      if (lead) {
        setSelectedLead(lead);
        setShowDetailModal(true);
      }
    } catch (err) {
      console.error("Error fetching lead:", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCustomer(id);
      setDeleteConfirm(null);
      fetchLeads();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete customer",
      );
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowFormModal(true);
  };

  const handleAddNew = () => {
    setEditingCustomer(null);
    setShowFormModal(true);
  };

  const handleFormSuccess = () => {
    setShowFormModal(false);
    setEditingCustomer(null);
    fetchLeads();
  };

  const handleDetailClick = (lead: Customer) => {
    setSelectedLead(lead);
    setShowDetailModal(true);
  };

  const toggleSelectCustomer = (customerId: number) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId],
    );
  };

  const toggleSelectAll = () => {
    if (selectedCustomers.length === filteredLeads.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredLeads.map((lead) => lead.id));
    }
  };

  const handleBatchPredict = () => {
    if (selectedCustomers.length === 0) return;

    showConfirm(
      "Confirm Batch Prediction",
      `Are you sure you want to predict ${selectedCustomers.length} selected customers?\n\nThis will trigger ML predictions for all selected customers.`,
      async () => {
        try {
          setIsBatchPredicting(true);
          const result = await predictBatchCustomers(selectedCustomers);

          const message = `Predicted: ${result.predictedCount || selectedCustomers.length} customers\nSuccessful: ${result.successCount || 0}\nFailed: ${result.failedCount || 0}`;

          showSuccess("Batch Prediction Complete", message);

          // Clear selection and refresh
          setSelectedCustomers([]);
          fetchLeads();
        } catch (err) {
          showError(
            "Batch Prediction Failed",
            err instanceof Error
              ? err.message
              : "Unknown error occurred during batch prediction",
          );
        } finally {
          setIsBatchPredicting(false);
        }
      },
    );
  };

  const filteredLeads = leads.filter((lead) => {
    const score = lead.probability_score ?? 0;
    if (scoreFilter === "high") return score >= 0.75;
    if (scoreFilter === "medium") return score >= 0.5 && score < 0.75;
    if (scoreFilter === "low") return score < 0.5;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Customer List</h2>
        <div className="flex gap-2">
          {selectedCustomers.length > 0 && (
            <button
              onClick={handleBatchPredict}
              disabled={isBatchPredicting}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {isBatchPredicting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Predicting...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Predict Selected ({selectedCustomers.length})
                </>
              )}
            </button>
          )}
          <button
            onClick={() => setShowCSVModal(true)}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            <Upload className="h-4 w-4" />
            Upload CSV
          </button>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* Search and Score Filter Row */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or job..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              {["all", "high", "medium", "low"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setScoreFilter(filter)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    scoreFilter === filter
                      ? filter === "high"
                        ? "bg-green-600 text-white"
                        : filter === "medium"
                          ? "bg-yellow-600 text-white"
                          : filter === "low"
                            ? "bg-red-600 text-white"
                            : "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Filter Toggle */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              <Filter className="h-4 w-4" />
              Advanced Filters
              {hasActiveFilters() && (
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                  Active
                </span>
              )}
            </button>
            {hasActiveFilters() && (
              <button
                onClick={clearAdvancedFilters}
                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-gray-100 pt-4">
              {/* Age Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minAge}
                    onChange={(e) => setMinAge(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxAge}
                    onChange={(e) => setMaxAge(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Job */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job
                </label>
                <select
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Jobs</option>
                  <option value="admin.">Admin</option>
                  <option value="blue-collar">Blue-collar</option>
                  <option value="entrepreneur">Entrepreneur</option>
                  <option value="housemaid">Housemaid</option>
                  <option value="management">Management</option>
                  <option value="retired">Retired</option>
                  <option value="self-employed">Self-employed</option>
                  <option value="services">Services</option>
                  <option value="student">Student</option>
                  <option value="technician">Technician</option>
                  <option value="unemployed">Unemployed</option>
                </select>
              </div>

              {/* Education */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Education
                </label>
                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Levels</option>
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="tertiary">Tertiary</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              {/* Marital Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marital Status
                </label>
                <select
                  value={marital}
                  onChange={(e) => setMarital(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                </select>
              </div>

              {/* Housing Loan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Housing Loan
                </label>
                <select
                  value={
                    housing === undefined ? "" : housing ? "true" : "false"
                  }
                  onChange={(e) =>
                    setHousing(
                      e.target.value === ""
                        ? undefined
                        : e.target.value === "true",
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              {/* Personal Loan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Personal Loan
                </label>
                <select
                  value={loan === undefined ? "" : loan ? "true" : "false"}
                  onChange={(e) =>
                    setLoan(
                      e.target.value === ""
                        ? undefined
                        : e.target.value === "true",
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">
                Customer List ({filteredLeads.length})
              </h3>
              {filteredLeads.length > 0 && (
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      selectedCustomers.length === filteredLeads.length &&
                      filteredLeads.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  Select All
                </label>
              )}
            </div>
            {filteredLeads.map((lead) => {
              const score = lead.probability_score ?? 0;
              const scoreColor =
                score >= 0.75
                  ? "text-green-600"
                  : score >= 0.5
                    ? "text-yellow-600"
                    : "text-red-600";

              // Prioritas: full_name > name > fallback to Customer ID
              const displayName =
                lead.full_name || lead.name || `Customer #${lead.id}`;
              const initial = displayName.charAt(0).toUpperCase();

              return (
                <div
                  key={lead.id}
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(lead.id)}
                      onChange={() => toggleSelectCustomer(lead.id)}
                      className="mt-4 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => handleDetailClick(lead)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                          {initial}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {displayName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {lead.job} • {lead.education} • {lead.age}y
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">Balance</p>
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(lead.balance)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Score</p>
                          <p className={`text-xl font-bold ${scoreColor}`}>
                            {(score * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-2 flex flex-col gap-2">
                      <button
                        onClick={() => handleEdit(lead)}
                        className="rounded p-2 text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(lead.id)}
                        className="rounded p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredLeads.length === 0 && !isLoading && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                <p className="text-gray-500">No leads found</p>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-6">
            {selectedLead && !showDetailModal ? (
              <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-gray-800">
                  Lead Details
                </h3>
                <p className="text-gray-500">Click on a lead to view details</p>
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
                <TrendingUp className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-500">
                  Select a lead to view details and prediction score
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {showDetailModal && selectedLead && (
        <LeadDetailModal
          customer={selectedLead}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedLead(null);
          }}
        />
      )}

      {showFormModal && (
        <CustomerFormModal
          customer={editingCustomer}
          onClose={() => {
            setShowFormModal(false);
            setEditingCustomer(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      {showCSVModal && (
        <CSVUploadModal
          onClose={() => setShowCSVModal(false)}
          onSuccess={() => {
            setShowCSVModal(false);
            fetchLeads();
          }}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Confirm Delete
            </h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this customer? This action cannot
              be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onConfirm={notification.onConfirm}
        confirmText={notification.type === "confirm" ? "Yes, Predict" : "OK"}
        cancelText="Cancel"
        autoClose={notification.type === "success"}
        autoCloseDuration={4000}
      />
    </div>
  );
}
