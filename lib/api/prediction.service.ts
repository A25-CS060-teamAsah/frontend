import apiClient from "./client";
import { ApiResponse, Customer } from "@/lib/types/customer.types";
import {
  PredictionStats,
  TopLeadsResponse,
  PredictionHistory,
  JobStatus,
  CacheStats,
  PredictionResult,
  BatchPredictionResult,
} from "@/lib/types/prediction.types";
import { AxiosError } from "axios";

const getErrorMessage = (error: unknown) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  if (axiosError.response?.data?.message) {
    return axiosError.response.data.message;
  }
  if (axiosError.message) {
    return axiosError.message;
  }
  return "Terjadi kesalahan pada server";
};

export const getTopLeads = async (
  params: {
    limit?: number;
    threshold?: number;
  } = {},
): Promise<Customer[]> => {
  try {
    const response = await apiClient.get<ApiResponse<TopLeadsResponse>>(
      "/predictions/top-leads",
      { params },
    );
    return response.data.data.leads;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getPredictionStats = async (): Promise<PredictionStats> => {
  try {
    const response =
      await apiClient.get<ApiResponse<PredictionStats>>("/predictions/stats");
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const predictSingleCustomer = async (
  customerId: number,
): Promise<PredictionResult> => {
  try {
    const response = await apiClient.post<ApiResponse<PredictionResult>>(
      `/predictions/customer/${customerId}`,
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const predictBatchCustomers = async (
  customerIds: number[],
): Promise<BatchPredictionResult> => {
  try {
    const response = await apiClient.post<ApiResponse<BatchPredictionResult>>(
      "/predictions/batch",
      { customerIds },
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getCustomerPredictionHistory = async (
  customerId: number,
): Promise<PredictionHistory[]> => {
  try {
    const response = await apiClient.get<
      ApiResponse<{ history: PredictionHistory[] }>
    >(`/predictions/customer/${customerId}/history`);
    return response.data.data.history;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getJobStatus = async (): Promise<JobStatus> => {
  try {
    const response = await apiClient.get<ApiResponse<JobStatus>>(
      "/predictions/job/status",
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getCacheStats = async (): Promise<CacheStats> => {
  try {
    const response = await apiClient.get<ApiResponse<CacheStats>>(
      "/predictions/cache/stats",
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const triggerManualPredictJob = async (): Promise<{
  message: string;
  results: { total: number; success: number; failed: number };
}> => {
  try {
    const response = await apiClient.post<
      ApiResponse<{
        message: string;
        results: { total: number; success: number; failed: number };
      }>
    >("/predictions/job/trigger");
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
