"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2, Plus, Edit, Trash2, TrendingUp } from "lucide-react";
import { getCustomers, deleteCustomer } from "@/lib/api/customer.service";
import { Customer } from "@/lib/types/customer.types";
import LeadDetailModal from "./organisms/lead-detail-modal";
import CustomerFormModal from "./organisms/customer-form-modal";

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
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    const customerId = searchParams.get("customerId");
    if (customerId) {
      fetchLeadById(parseInt(customerId));
    }
     
  }, [searchParams]);

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery, scoreFilter]);

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
      });

      setLeads(response.customers);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads");
    } finally {
      setIsLoading(false);
    }
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
      setError(err instanceof Error ? err.message : "Failed to delete customer");
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
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Lead
        </button>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
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
            <h3 className="text-lg font-bold text-gray-800">
              Customer List ({filteredLeads.length})
            </h3>
            {filteredLeads.map((lead) => {
              const score = lead.probability_score ?? 0;
              const scoreColor =
                score >= 0.75
                  ? "text-green-600"
                  : score >= 0.5
                    ? "text-yellow-600"
                    : "text-red-600";

              return (
                <div
                  key={lead.id}
                  className="cursor-pointer rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="flex-1"
                      onClick={() => handleDetailClick(lead)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                          {(lead.full_name || lead.job || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {lead.full_name || `${lead.job} (${lead.age}y)`}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {lead.job} • {lead.education}
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
                <p className="text-gray-500">
                  Click on a lead to view details
                </p>
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
    </div>
  );
} 
