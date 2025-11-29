import { Customer } from "./customer.types";

export interface PredictionStats {
  totalPredictions: number;
  averageScore: string;
  positivePredictions: number;
  negativePredictions: number;
  highestScore: string;
  lowestScore: string;
  conversionRate: string;
}

export interface TopLeadsResponse {
  leads: Customer[];
  count: number;
  threshold: number;
}

