import apiClient from "./client";
import {
  ApiResponse,
  Customer,
  CustomerListResponse,
  CustomerPayload,
  CustomerQueryParams,
  CustomerStats,
} from "@/lib/types/customer.types";
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

export const getCustomers = async (
  params: CustomerQueryParams = {}
): Promise<CustomerListResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<CustomerListResponse>>(
      "/api/v1/customers",
      { params }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getCustomerStats = async (): Promise<CustomerStats> => {
  try {
    const response = await apiClient.get<ApiResponse<CustomerStats>>(
      "/api/v1/customers/stats"
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createCustomer = async (
  payload: CustomerPayload
): Promise<Customer> => {
  try {
    const response = await apiClient.post<ApiResponse<Customer>>(
      "/api/v1/customers",
      payload
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateCustomer = async (
  id: number,
  payload: Partial<CustomerPayload>
): Promise<Customer> => {
  try {
    const response = await apiClient.put<ApiResponse<Customer>>(
      `/api/v1/customers/${id}`,
      payload
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteCustomer = async (id: number): Promise<void> => {
  try {
    await apiClient.delete<ApiResponse<null>>(`/api/v1/customers/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const uploadCSV = async (file: File): Promise<{
  message: string;
  imported: number;
  failed: number;
  errors?: any[];
}> => {
  try {
    const formData = new FormData();
    formData.append("csvfile", file); // Must match backend field name

    const response = await apiClient.post<any>("/customers/upload-csv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Backend returns different structure, transform it to expected format
    const backendData = response.data;

    return {
      message: backendData.message || "CSV upload processed",
      imported: backendData.summary?.successfullyCreated || 0,
      failed: backendData.summary?.failedToCreate || 0,
      errors: [
        ...(backendData.validationErrors || []),
        ...(backendData.insertionErrors || [])
      ]
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const downloadCSVTemplate = async (): Promise<Blob> => {
  try {
    const response = await apiClient.get("/customers/csv-template", {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

