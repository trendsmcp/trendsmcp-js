export type TrendsSource =
  | "google search"
  | "google images"
  | "google news"
  | "google shopping"
  | "youtube"
  | "tiktok"
  | "reddit"
  | "amazon"
  | "wikipedia"
  | "news volume"
  | "news sentiment"
  | "npm"
  | "steam";

export interface GetTrendsParams {
  source: TrendsSource;
  keyword: string;
  data_mode?: "weekly" | "daily";
}

export interface TrendsDataPoint {
  date: string;
  value: number;
  volume: number | null;
  keyword: string;
  source: string;
}

export type GetTrendsResponse = TrendsDataPoint[];

export type GrowthPreset =
  | "7D" | "14D" | "30D"
  | "1M" | "2M" | "3M" | "6M" | "9M" | "12M"
  | "1Y" | "18M" | "24M" | "2Y" | "36M" | "3Y" | "48M" | "60M" | "5Y"
  | "MTD" | "QTD" | "YTD";

export interface CustomGrowthPeriod {
  name?: string;
  recent: string;
  baseline: string;
}

export interface GetGrowthParams {
  source: TrendsSource;
  keyword: string;
  percent_growth: Array<GrowthPreset | CustomGrowthPeriod>;
  data_mode?: "weekly" | "daily";
}

export interface GrowthResult {
  period: string;
  growth: number;
  direction: "increase" | "decrease";
  recent_date: string;
  baseline_date: string;
  recent_value: number;
  baseline_value: number;
  volume_available: boolean;
  recent_volume: number | null;
  baseline_volume: number | null;
  volume_growth: number | null;
}

export interface GrowthMetadata {
  total_data_points: number;
  calculations_completed: number;
  all_successful: boolean;
}

export interface GetGrowthResponse {
  search_term: string;
  data_source: string;
  results: GrowthResult[];
  metadata: GrowthMetadata;
}

export interface TrendsMcpErrorBody {
  error: string;
  message: string;
}

export class TrendsMcpError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, body: TrendsMcpErrorBody) {
    super(body.message);
    this.name = "TrendsMcpError";
    this.status = status;
    this.code = body.error ?? String(status);
  }
}
