"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Customer, CustomerPayload } from "@/lib/types/customer.types";
import { createCustomer, updateCustomer } from "@/lib/api/customer.service";
import {
  JOB_OPTIONS,
  MARITAL_OPTIONS,
  EDUCATION_OPTIONS,
  CONTACT_OPTIONS,
  MONTH_OPTIONS,
  DAY_OPTIONS,
  POUTCOME_OPTIONS,
} from "@/lib/constants/customer-options";

interface CustomerFormModalProps {
  customer: Customer | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CustomerFormModal({
  customer,
  onClose,
  onSuccess,
}: CustomerFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CustomerPayload>({
    full_name: "",
    balance: 0,
    age: 18,
    job: "technician",
    marital: "single",
    education: "secondary",
    has_default: false,
    has_housing_loan: false,
    has_personal_loan: false,
    contact: "cellular",
    month: "jan",
    day_of_week: "mon",
    campaign: 1,
    pdays: 999,
    previous: 0,
    poutcome: "unknown",
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        full_name: customer.full_name || customer.name || "",
        balance: customer.balance ?? 0,
        age: customer.age,
        job: customer.job,
        marital: customer.marital,
        education: customer.education,
        has_default: customer.has_default,
        has_housing_loan: customer.has_housing_loan,
        has_personal_loan: customer.has_personal_loan,
        contact: customer.contact,
        month: customer.month,
        day_of_week: customer.day_of_week,
        campaign: customer.campaign,
        pdays: customer.pdays,
        previous: customer.previous,
        poutcome: customer.poutcome,
      });
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (customer) {
        await updateCustomer(customer.id, formData);
      } else {
        await createCustomer(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    field: keyof CustomerPayload,
    value: string | number | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 bg-linear-to-r from-blue-50 to-white px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900">
            {customer ? "Edit Customer" : "Add New Customer"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-h-[80vh] overflow-y-auto p-6"
        >
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Balance
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.balance}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  handleChange("balance", isNaN(val) ? 0 : val);
                }}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Age *
              </label>
              <input
                type="number"
                min="18"
                max="100"
                required
                value={formData.age}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) handleChange("age", val);
                }}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Job *
              </label>
              <select
                required
                value={formData.job}
                onChange={(e) => handleChange("job", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {JOB_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Marital Status *
              </label>
              <select
                required
                value={formData.marital}
                onChange={(e) => handleChange("marital", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {MARITAL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Education *
              </label>
              <select
                required
                value={formData.education}
                onChange={(e) => handleChange("education", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {EDUCATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Contact *
              </label>
              <select
                required
                value={formData.contact}
                onChange={(e) => handleChange("contact", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CONTACT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Month *
              </label>
              <select
                required
                value={formData.month}
                onChange={(e) => handleChange("month", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {MONTH_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Day of Week *
              </label>
              <select
                required
                value={formData.day_of_week}
                onChange={(e) => handleChange("day_of_week", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {DAY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Previous Outcome *
              </label>
              <select
                required
                value={formData.poutcome}
                onChange={(e) => handleChange("poutcome", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {POUTCOME_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Campaign *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.campaign}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) handleChange("campaign", val);
                }}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Days Since Previous Contact
              </label>
              <input
                type="number"
                value={formData.pdays}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) handleChange("pdays", val);
                }}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Previous Contacts
              </label>
              <input
                type="number"
                min="0"
                value={formData.previous}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) handleChange("previous", val);
                }}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="has_default"
                checked={formData.has_default}
                onChange={(e) => handleChange("has_default", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="has_default"
                className="text-sm font-medium text-gray-700"
              >
                Has Credit Default
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="has_housing_loan"
                checked={formData.has_housing_loan}
                onChange={(e) =>
                  handleChange("has_housing_loan", e.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="has_housing_loan"
                className="text-sm font-medium text-gray-700"
              >
                Has Housing Loan
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="has_personal_loan"
                checked={formData.has_personal_loan}
                onChange={(e) =>
                  handleChange("has_personal_loan", e.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="has_personal_loan"
                className="text-sm font-medium text-gray-700"
              >
                Has Personal Loan
              </label>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {customer ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
