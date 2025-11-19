import apiClient from "./client";
import { ApiResponse, Customer } from "@/lib/types/customer.types";
import {
  PredictionStats,
  TopLeadsResponse,
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

export const getTopLeads = async (params: {
  limit?: number;
  threshold?: number;
} = {}): Promise<Customer[]> => {
  try {
    const response = await apiClient.get<ApiResponse<TopLeadsResponse>>(
      "/predictions/top-leads",
      { params }
    );
    return response.data.data.leads;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getPredictionStats = async (): Promise<PredictionStats> => {
  try {
    const response = await apiClient.get<ApiResponse<PredictionStats>>(
      "/predictions/stats"
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

