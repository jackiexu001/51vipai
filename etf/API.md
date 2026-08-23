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
