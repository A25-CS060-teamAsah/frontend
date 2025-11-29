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
  full_name?: string | null;
  balance?: number | null;
  email?: string | null;
  phone?: string | null;
}

export interface CustomerListResponse {
  customers: Customer[];
  pagination: PaginationMeta;
}

export interface CustomerStats {
  total_customers: number;
  avg_age: number;
  with_housing_loan: number;
  with_personal_loan: number;
  unique_jobs: number;
  unique_education_levels: number;
  pending_calls?: number;
  monthly_conversions?: number;
  monthly_trend?: MonthlyTrend[];
  high_priority_count?: number;
  avg_score?: number;
}

export interface MonthlyTrend {
  month: string;
  total: number;
  highPriority?: number;
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

