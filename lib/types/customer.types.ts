export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Customer {
  id: number;
  name?: string | null; // Database field name
  full_name?: string | null; // Alias for frontend (mapped from name)
  age: number;
  job: string;
  marital: string;
  education: string;
  has_default: boolean;
  has_housing_loan: boolean;
  has_personal_loan: boolean;
  contact: string;
  month: string;
  day_of_week: string;
  campaign: number;
  pdays: number;
  previous: number;
  poutcome: string;
  probability_score?: number | null;
  will_subscribe?: boolean | null;
  predicted_at?: string | null;
  model_version?: string | null;
  created_at?: string;
  updated_at?: string;
  balance?: number | null;
  email?: string | null;
  phone?: string | null;
}

export interface CustomerListResponse {
  customers: Customer[];
  pagination: PaginationMeta;
}

export interface CustomerStats {
  totalCustomers: number;
  avgAge: string;
  withHousingLoan: number;
  withPersonalLoan: number;
  uniqueJobs: number;
  uniqueEducationLevels: number;
  pendingCalls?: number;
  monthlyConversions?: number;
  monthlyTrend?: MonthlyTrend[];
  highPriorityCount?: number;
  avgScore?: number;
}

export interface MonthlyTrend {
  month: string;
  total: number;
  highPriority?: number;
  willSubscribe?: number;
  avgScore?: number;
}

export type CustomerPayload = {
  full_name?: string;
  balance?: number;
  age: number;
  job: string;
  marital: string;
  education: string;
  has_default?: boolean;
  has_housing_loan?: boolean;
  has_personal_loan?: boolean;
  contact: string;
  month: string;
  day_of_week: string;
  campaign: number;
  pdays: number;
  previous: number;
  poutcome: string;
};

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CustomerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: "ASC" | "DESC";
  minAge?: number;
  maxAge?: number;
  job?: string;
  education?: string;
  housing?: boolean;
  loan?: boolean;
  hasDefault?: boolean;
  marital?: string;
}
