import { Customer } from "./customer.types";

export interface PredictionStats {
  totalPredictions: number;
  averageScore: string;
  positivePredictions: number;
  negativePredictions: number;
  highestScore: string;
  lowestScore: string;
  highPriorityCount: number;
  mediumPriorityCount: number;
  lowPriorityCount: number;
  customersWithPredictions: number;
  customersWithoutPredictions: number;
  conversionRate: string;
}

export interface TopLeadsResponse {
  leads: Customer[];
  count: number;
  threshold: number;
}

export interface PredictionResult {
  prediction: {
    id: number;
    customer_id: number;
    probability_score: number;
    predicted_at: string;
  };
  customer: Customer;
  message: string;
}

export interface BatchPredictionResult {
  predictions: Array<{
    customer_id: number;
    probability_score: number;
  }>;
  successful: number;
  failed: number;
  message: string;
  predictedCount?: number;
  successCount?: number;
  failedCount?: number;
}

export interface PredictionHistory {
  id: number;
  customer_id: number;
  probability_score: number;
  predicted_at: string;
  will_subscribe?: boolean;
  model_version?: string;
}

export interface JobStatus {
  enabled: boolean;
  running: boolean;
  isRunning?: boolean;
  lastRun: string | null;
  nextRun: string | null;
  lastRunTime?: string | null;
  nextRunTime?: string | null;
  cronEnabled?: boolean;
  cronSchedule?: string;
  totalRuns?: number;
  cacheStats: {
    keys: number;
    hits: number;
    misses: number;
    ksize: number;
    vsize: number;
  };
}

export interface CacheStats {
  keys: number;
  hits: number;
  misses: number;
  ksize: number;
  vsize: number;
}
