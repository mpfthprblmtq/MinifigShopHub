import { PartResult } from "./PartResult";

export interface PartsResponse {
  count: number;
  next?: string;
  previous?: string;
  results: PartResult[];
}