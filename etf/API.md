# ETF Dashboard API Contract

The first-stage ETF interface reads one endpoint:

```text
GET /api/v1/etf/dashboard
```

The response must include its source and effective timestamp. The interface rejects payloads without this metadata instead of presenting unverified values.

```json
{
  "meta": {
    "source": "Licensed data provider",
    "asOf": "2026-08-23T10:30:00+08:00",
    "generatedAt": "2026-08-23T10:31:12+08:00",
    "version": 1
  },
  "metrics": [
    {
      "id": "vix",
      "label": "VIX 恐慌指数",
      "value": 15.2,
      "displayValue": "15.20",
      "changePct": -1.2,
      "note": "延迟行情"
    }
  ],
  "datasets": {
    "onExchange": [],
    "nasdaq": [],
    "sp500": [],
    "active": []
  }
}
```

## Fund fields

All fields except `code` and `name` may be `null` when the source does not provide a compatible value.

| Field | Type | Meaning |
|---|---|---|
| `code` | string | Fund or ETF code |
| `name` | string | Public fund name |
| `trackingIndex` | string | Tracked index |
| `scaleCny100m` | number | Scale in CNY 100 million |
| `return1yPct` | number | One-year return in percent |
| `marketChangePct` | number | Latest exchange price change in percent |
| `premiumPct` | number | Same-date price versus NAV premium in percent |
| `turnoverCny100m` | number | Turnover in CNY 100 million |
| `trackingErrorPct` | number | Tracking error in percent |
| `feeRatePct` | number | Combined annual fee rate in percent |
| `dailyLimit` | string | Human-readable subscription limit |
| `purchaseStatus` | string | `open`, `limited`, or `suspended` |

The production API should also expose field-level dates and provenance internally so incompatible dates can be rejected before this aggregate response is generated.

## Phase 2 live data sources

The second-stage Worker can generate and persist a live dashboard snapshot when no verified snapshot exists, and the scheduled Worker refreshes it every 15 minutes.

Current public sources:

| Area | Source | Current fields |
|---|---|---|
| Market metrics | Yahoo Finance chart API | S&P 500, Nasdaq 100, VIX, USD/CNY latest value and daily change |
| Listed ETF quotes | Eastmoney quote API | Exchange price change and turnover |
| Fund details | Eastmoney fund detail script | Fund name, one-year return, latest NAV, latest scale |
| QDII ranking | Eastmoney QDII ranking script | Active QDII selection and one-year return fallback |

Known limitations:

- Listed ETF quotes use a multi-source fallback: Eastmoney batch quotes first, then Tencent, then Sina.
- Listed ETF premium currently uses the latest available fund NAV against the exchange price, so date gaps can make the figure an estimate rather than same-timestamp IOPV premium.
- Purchase status, daily subscription limits, and tracking error are intentionally left `null` until a reliable announcement/status source or manual admin workflow is added.
- Public web sources can change response formats. The Worker fails closed and keeps the previous verified snapshot instead of inventing values.

Operational diagnostics:

```text
GET /api/v1/etf/diagnostics/quotes
```

This read-only endpoint checks the listed-ETF quote fallbacks from the deployed runtime and returns only source health plus sample price fields.
