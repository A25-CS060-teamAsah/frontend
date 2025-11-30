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
}

export interface PredictionHistory {
  id: number;
  customer_id: number;
  probability_score: number;
  predicted_at: string;
}

export interface JobStatus {
  enabled: boolean;
  running: boolean;
  lastRun: string | null;
  nextRun: string | null;
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

