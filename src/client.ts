import {
  GetTrendsParams,
  GetTrendsResponse,
  GetGrowthParams,
  GetGrowthResponse,
  TrendsMcpError,
  TrendsMcpErrorBody,
} from "./types.js";

const BASE_URL = "https://api.trendsmcp.ai/api";

export interface TrendsMcpClientOptions {
  apiKey: string;
  baseUrl?: string;
}

export class TrendsMcpClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(options: TrendsMcpClientOptions) {
    if (!options.apiKey) {
      throw new Error(
        "TrendsMcpClient: apiKey is required. Get a free key at https://trendsmcp.ai"
      );
    }
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl?.replace(/\/$/, "") ?? BASE_URL;
  }

  private async post<T>(body: Record<string, unknown>): Promise<T> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const envelope = (await res.json()) as any;

    let parsed: T;
    if (
      envelope !== null &&
      typeof envelope === "object" &&
      typeof envelope.statusCode === "number" &&
      typeof envelope.body === "string"
    ) {
      parsed = JSON.parse(envelope.body) as T;
      if (envelope.statusCode >= 400) {
        throw new TrendsMcpError(envelope.statusCode, parsed as unknown as TrendsMcpErrorBody);
      }
    } else {
      if (!res.ok) {
        throw new TrendsMcpError(res.status, envelope as TrendsMcpErrorBody);
      }
      parsed = envelope as T;
    }

    return parsed;
  }

  getTrends(params: GetTrendsParams): Promise<GetTrendsResponse> {
    const body: Record<string, unknown> = {
      source: params.source,
      keyword: params.keyword,
    };
    if (params.data_mode) body.data_mode = params.data_mode;
    return this.post<GetTrendsResponse>(body);
  }

  getGrowth(params: GetGrowthParams): Promise<GetGrowthResponse> {
    const body: Record<string, unknown> = {
      source: params.source,
      keyword: params.keyword,
      percent_growth: params.percent_growth,
    };
    if (params.data_mode) body.data_mode = params.data_mode;
    return this.post<GetGrowthResponse>(body);
  }
}
