# trendsmcp

JavaScript/TypeScript client for the [Trends MCP API](https://trendsmcp.ai). Query keyword trend time series and growth percentages across Google Search, YouTube, Reddit, Amazon, TikTok, Wikipedia, npm, Steam, and more from a single endpoint.

100 requests/month free. No credit card. [Get your key](https://trendsmcp.ai)

## Install

```bash
npm install trendsmcp
```

```bash
yarn add trendsmcp
```

```bash
pnpm add trendsmcp
```

## Quick start

```ts
import { TrendsMcpClient } from "trendsmcp";

const client = new TrendsMcpClient({ apiKey: "YOUR_API_KEY" });

// 5-year weekly time series
const series = await client.getTrends({
  source: "google search",
  keyword: "bitcoin",
});

// Growth across multiple periods
const growth = await client.getGrowth({
  source: "google search",
  keyword: "nike",
  percent_growth: ["12M", "3M", "YTD"],
});
```

## Methods

### `getTrends(params)`

Returns a historical time series for a keyword from a single source. Defaults to 5 years of weekly data. Set `data_mode: "daily"` for the last 30 days.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `source` | `TrendsSource` | Yes | Data source |
| `keyword` | `string` | Yes | Keyword, brand, product, or topic |
| `data_mode` | `"weekly" | "daily"` | No | Defaults to weekly (5 years) |

### `getGrowth(params)`

Calculates point-to-point percentage growth over one or more time windows.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `source` | `TrendsSource` | Yes | Data source |
| `keyword` | `string` | Yes | Keyword, brand, or topic |
| `percent_growth` | `Array` | Yes | Preset strings or custom date pairs |

**Growth presets:** `7D` `14D` `30D` `1M` `2M` `3M` `6M` `9M` `12M` `1Y` `18M` `24M` `2Y` `36M` `3Y` `48M` `60M` `5Y` `MTD` `QTD` `YTD`

**Custom date range:**

```ts
// Preset periods
const growth = await client.getGrowth({
  source: "google search",
  keyword: "nike",
  percent_growth: ["12M", "3M", "YTD"],
});

// Custom date comparison
const custom = await client.getGrowth({
  source: "amazon",
  keyword: "air fryer",
  percent_growth: [
    { name: "holiday lift", recent: "2025-12-31", baseline: "2025-10-01" }
  ],
});
```

## Data sources

| `source` | Description |
|---|---|
| `"google search"` | Google search volume |
| `"google images"` | Google image search volume |
| `"google news"` | Google News search volume |
| `"google shopping"` | Google Shopping search volume |
| `"youtube"` | YouTube search volume |
| `"tiktok"` | TikTok hashtag volume |
| `"reddit"` | Reddit mention volume |
| `"amazon"` | Amazon product search volume |
| `"wikipedia"` | Wikipedia page views |
| `"news volume"` | News article mention volume |
| `"news sentiment"` | News sentiment score |
| `"npm"` | npm package weekly downloads |
| `"steam"` | Steam concurrent players (monthly) |

All values are normalized to a 0-100 relative scale.

## Error handling

```ts
import { TrendsMcpClient, TrendsMcpError } from "trendsmcp";

try {
  const series = await client.getTrends({ source: "google search", keyword: "bitcoin" });
} catch (err) {
  if (err instanceof TrendsMcpError) {
    console.error(err.status); // 429
    console.error(err.code);   // "rate_limited"
    console.error(err.message);
  }
}
```

## TypeScript support

Full types included. No `@types` package needed.

## Links

- [API docs](https://trendsmcp.ai/docs)
- [Get a free API key](https://trendsmcp.ai)

## License

MIT
