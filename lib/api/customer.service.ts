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
      "/customers",
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
      "/customers/stats"
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
      "/customers",
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
      `/customers/${id}`,
      payload
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteCustomer = async (id: number): Promise<void> => {
  try {
    await apiClient.delete<ApiResponse<null>>(`/customers/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

