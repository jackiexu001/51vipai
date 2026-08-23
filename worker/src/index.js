const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
};

const SOURCE_ID = "eastmoney-yahoo-public";
const SOURCE_LABEL = "东方财富公开数据 + Yahoo Finance 延迟行情";
const USER_AGENT =
  "Mozilla/5.0 (compatible; 51vipai-etf/1.0; +https://www.51vipai.com/)";

const ON_EXCHANGE_FUNDS = [
  { code: "513100", market: 1, trackingIndex: "纳斯达克100", feeRatePct: 0.8 },
  { code: "513110", market: 1, trackingIndex: "纳斯达克100", feeRatePct: 1.0 },
  { code: "159941", market: 0, trackingIndex: "纳斯达克100", feeRatePct: 1.0 },
  { code: "513300", market: 1, trackingIndex: "纳斯达克100", feeRatePct: 0.8 },
  { code: "159659", market: 0, trackingIndex: "纳斯达克100", feeRatePct: 0.65 },
  { code: "159632", market: 0, trackingIndex: "纳斯达克100", feeRatePct: 0.8 },
  { code: "513500", market: 1, trackingIndex: "标普500", feeRatePct: 0.8 },
  { code: "159612", market: 0, trackingIndex: "标普500", feeRatePct: 0.6 },
  { code: "513650", market: 1, trackingIndex: "标普500", feeRatePct: 0.8 },
  { code: "513730", market: 1, trackingIndex: "标普500", feeRatePct: 0.8 },
];

const INDEX_QDII_FUNDS = [
  { code: "040046", category: "nasdaq", trackingIndex: "纳斯达克100", feeRatePct: 0.8 },
  { code: "270042", category: "nasdaq", trackingIndex: "纳斯达克100", feeRatePct: 0.8 },
  { code: "000834", category: "nasdaq", trackingIndex: "纳斯达克100", feeRatePct: 0.8 },
  { code: "015299", category: "nasdaq", trackingIndex: "纳斯达克100", feeRatePct: 0.8 },
  { code: "018966", category: "nasdaq", trackingIndex: "纳斯达克100", feeRatePct: 0.8 },
  { code: "050025", category: "sp500", trackingIndex: "标普500", feeRatePct: 0.8 },
  { code: "161125", category: "sp500", trackingIndex: "标普500", feeRatePct: 0.8 },
  { code: "007721", category: "sp500", trackingIndex: "标普500", feeRatePct: 0.8 },
];

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { ...JSON_HEADERS, ...(init.headers || {}) },
  });
}

function errorResponse(status, code, message, details) {
  return json({ error: { code, message, ...(details ? { details } : {}) } }, { status });
}

function toNumber(value) {
  if (value === null || value === undefined || value === "" || value === "--") return null;
  const number = Number(String(value).replace(/[%,$,\s]/g, ""));
  return Number.isFinite(number) ? number : null;
}

function compactObject(value) {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined));
}

function formatPct(value) {
  return value === null ? "—" : `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function marketTimestamp(meta) {
  const timestamp = meta?.regularMarketTime || meta?.firstTradeDate;
  if (!timestamp) return new Date().toISOString();
  return new Date(timestamp * 1000).toISOString();
}

async function fetchText(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "user-agent": USER_AGENT,
      accept: "*/*",
      ...(options.headers || {}),
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} from ${url}`);
  return response.text();
}

async function fetchJson(url, options = {}) {
  const text = await fetchText(url, options);
  return JSON.parse(text);
}

async function fetchYahooChart(symbol) {
  const encoded = encodeURIComponent(symbol);
  const data = await fetchJson(`https://query1.finance.yahoo.com/v8/finance/chart/${encoded}?range=1y&interval=1d`, {
    headers: { accept: "application/json" },
  });
  const result = data?.chart?.result?.[0];
  if (!result?.meta) throw new Error(`Yahoo chart missing data for ${symbol}`);
  const quote = result.indicators?.quote?.[0] || {};
  const closes = (quote.close || []).filter((item) => typeof item === "number");
  const previous = closes.length > 1 ? closes[closes.length - 2] : result.meta.chartPreviousClose;
  const current = result.meta.regularMarketPrice ?? closes[closes.length - 1] ?? null;
  const changePct = current && previous ? ((current - previous) / previous) * 100 : null;
  return {
    value: current,
    changePct,
    asOf: marketTimestamp(result.meta),
  };
}

async function buildMarketMetrics() {
  const metrics = await Promise.allSettled([
    metricFromYahoo("^GSPC", "sp500", "标普500"),
    metricFromYahoo("^NDX", "nasdaq100", "纳斯达克100"),
    metricFromYahoo("^VIX", "vix", "VIX 恐慌指数"),
    metricFromYahoo("USDCNY=X", "usdcny", "美元/人民币"),
  ]);
  return metrics.flatMap((result) => (result.status === "fulfilled" ? [result.value] : []));
}

async function metricFromYahoo(symbol, id, label) {
  const chart = await fetchYahooChart(symbol);
  return compactObject({
    id,
    label,
    value: chart.value,
    displayValue: chart.value === null ? "—" : chart.value.toLocaleString("zh-CN", { maximumFractionDigits: id === "usdcny" ? 4 : 2 }),
    changePct: chart.changePct,
    note: `${formatPct(chart.changePct)} · Yahoo Finance 延迟行情`,
    asOf: chart.asOf,
  });
}

function extractVariable(script, name) {
  const match = script.match(new RegExp(`var\\s+${name}\\s*=\\s*([^;]*);`));
  return match ? match[1].trim() : null;
}

function parseJsonVariable(script, name) {
  const raw = extractVariable(script, name);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function parseStringVariable(script, name) {
  const raw = extractVariable(script, name);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return raw.replace(/^"|"$/g, "");
  }
}

async function fetchFundDetail(code) {
  const script = await fetchText(`https://fund.eastmoney.com/pingzhongdata/${code}.js`, {
    headers: { referer: `https://fund.eastmoney.com/${code}.html` },
  });
  const netWorthTrend = parseJsonVariable(script, "Data_netWorthTrend") || [];
  const scale = parseJsonVariable(script, "Data_fluctuationScale");
  const latestNetWorth = netWorthTrend.length ? netWorthTrend[netWorthTrend.length - 1] : null;
  const latestScale = scale?.series?.length ? scale.series[scale.series.length - 1]?.y : null;
  return {
    code,
    name: parseStringVariable(script, "fS_name"),
    return1yPct: toNumber(extractVariable(script, "syl_1n")?.replace(/^"|"$/g, "")),
    nav: toNumber(latestNetWorth?.y),
    navDate: latestNetWorth?.x ? new Date(latestNetWorth.x).toISOString() : null,
    scaleCny100m: toNumber(latestScale),
  };
}

async function fetchEastmoneyQuote(fund) {
  const fields = "f43,f48,f57,f58,f60,f170";
  const data = await fetchJson(
    `https://push2.eastmoney.com/api/qt/stock/get?secid=${fund.market}.${fund.code}&fields=${fields}`,
    { headers: { referer: "https://quote.eastmoney.com/" } },
  );
  if (!data?.data) throw new Error(`Eastmoney quote missing data for ${fund.code}`);
  return {
    code: data.data.f57 || fund.code,
    name: data.data.f58,
    price: toNumber(data.data.f43) === null ? null : toNumber(data.data.f43) / 1000,
    previousClose: toNumber(data.data.f60) === null ? null : toNumber(data.data.f60) / 1000,
    marketChangePct: toNumber(data.data.f170) === null ? null : toNumber(data.data.f170) / 100,
    turnoverCny100m: toNumber(data.data.f48) === null ? null : toNumber(data.data.f48) / 100000000,
  };
}

async function buildOnExchangeFunds() {
  const rows = await Promise.allSettled(
    ON_EXCHANGE_FUNDS.map(async (fund) => {
      const [quote, detail] = await Promise.all([fetchEastmoneyQuote(fund), fetchFundDetail(fund.code)]);
      const premiumPct = quote.price && detail.nav ? ((quote.price - detail.nav) / detail.nav) * 100 : null;
      return compactObject({
        code: fund.code,
        name: detail.name || quote.name || fund.code,
        trackingIndex: fund.trackingIndex,
        scaleCny100m: detail.scaleCny100m,
        return1yPct: detail.return1yPct,
        marketChangePct: quote.marketChangePct,
        premiumPct,
        turnoverCny100m: quote.turnoverCny100m,
        trackingErrorPct: null,
        feeRatePct: fund.feeRatePct,
        dailyLimit: null,
        purchaseStatus: null,
      });
    }),
  );
  return rows.flatMap((result) => (result.status === "fulfilled" ? [result.value] : []));
}

async function fetchQdiiRankRows() {
  const end = new Date();
  const start = new Date(end);
  start.setFullYear(start.getFullYear() - 1);
  const date = (value) => value.toISOString().slice(0, 10);
  const url =
    `https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=qdii&rs=&gs=0&sc=1nzf&st=desc&sd=${date(start)}&ed=${date(end)}&qdii=&tabSubtype=,,,,&pi=1&pn=220&dx=1&v=${Date.now()}`;
  const text = await fetchText(url, { headers: { referer: "https://fund.eastmoney.com/data/fundranking.html" } });
  const match = text.match(/datas:(\[.*?\]),allRecords:/s);
  if (!match) throw new Error("Eastmoney rank data is missing datas array");
  const rows = JSON.parse(match[1]);
  return rows.map((line) => {
    const fields = line.split(",");
    return {
      code: fields[0],
      name: fields[1],
      navDate: fields[3],
      return1yPct: toNumber(fields[11]),
      feeRatePct: toNumber(fields[18]),
    };
  });
}

function qdiiCategory(name) {
  if (/纳斯达克|NASDAQ|Nasdaq/i.test(name)) return "nasdaq";
  if (/标普|S&P|SP500|500ETF联接/i.test(name)) return "sp500";
  if (/美元|C类|C份额|人民币C|联接C/.test(name)) return null;
  return "active";
}

function trackingIndexForFund(name, category) {
  if (category === "nasdaq") return "纳斯达克100";
  if (category === "sp500") return "标普500";
  if (/科技|互联网|移动互联|全球成长|全球产业|高端制造|新兴市场|亚洲机会/.test(name)) return "主动美股/QDII";
  return "QDII";
}

async function enrichQdiiFund(row) {
  let detail = {};
  try {
    detail = await fetchFundDetail(row.code);
  } catch {
    detail = {};
  }
  const category = qdiiCategory(row.name);
  return compactObject({
    code: row.code,
    name: detail.name || row.name,
    trackingIndex: trackingIndexForFund(row.name, category),
    scaleCny100m: detail.scaleCny100m,
    return1yPct: detail.return1yPct ?? row.return1yPct,
    marketChangePct: null,
    premiumPct: null,
    turnoverCny100m: null,
    trackingErrorPct: null,
    feeRatePct: row.feeRatePct,
    dailyLimit: null,
    purchaseStatus: null,
    _category: category,
  });
}

async function buildIndexQdiiFund(fund) {
  const detail = await fetchFundDetail(fund.code);
  return compactObject({
    code: fund.code,
    name: detail.name || fund.code,
    trackingIndex: fund.trackingIndex,
    scaleCny100m: detail.scaleCny100m,
    return1yPct: detail.return1yPct,
    marketChangePct: null,
    premiumPct: null,
    turnoverCny100m: null,
    trackingErrorPct: null,
    feeRatePct: fund.feeRatePct,
    dailyLimit: null,
    purchaseStatus: null,
    _category: fund.category,
  });
}

async function buildQdiiDatasets() {
  const rows = (await fetchQdiiRankRows()).filter((row) => qdiiCategory(row.name));
  const selected = rows.filter((row) => qdiiCategory(row.name) === "active").slice(0, 12);
  const enriched = await Promise.allSettled([
    ...INDEX_QDII_FUNDS.map(buildIndexQdiiFund),
    ...selected.map(enrichQdiiFund),
  ]);
  const funds = enriched.flatMap((result) => (result.status === "fulfilled" ? [result.value] : []));
  return {
    nasdaq: funds.filter((fund) => fund._category === "nasdaq").map(({ _category, ...fund }) => fund),
    sp500: funds.filter((fund) => fund._category === "sp500").map(({ _category, ...fund }) => fund),
    active: funds.filter((fund) => fund._category === "active").map(({ _category, ...fund }) => fund),
  };
}

function validateSnapshot(snapshot) {
  const datasets = snapshot?.datasets;
  if (!snapshot?.meta?.source || !snapshot?.meta?.asOf || !Array.isArray(snapshot.metrics)) return false;
  return ["onExchange", "nasdaq", "sp500", "active"].every((key) => Array.isArray(datasets?.[key]));
}

async function buildDashboardSnapshot() {
  const generatedAt = new Date().toISOString();
  const [metrics, onExchange, qdii] = await Promise.all([
    buildMarketMetrics(),
    buildOnExchangeFunds(),
    buildQdiiDatasets(),
  ]);
  const snapshot = {
    meta: {
      source: SOURCE_LABEL,
      asOf: generatedAt,
      generatedAt,
      version: 1,
    },
    metrics,
    datasets: {
      onExchange,
      nasdaq: qdii.nasdaq,
      sp500: qdii.sp500,
      active: qdii.active,
    },
  };
  if (!validateSnapshot(snapshot)) throw new Error("Generated ETF dashboard snapshot is invalid");
  return snapshot;
}

async function checksum(value) {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function persistSource(env) {
  await env.DB.prepare(
    `INSERT INTO data_sources (id, display_name, source_type, base_url, license_note, enabled, updated_at)
     VALUES (?, ?, 'public-web', ?, ?, 1, ?)
     ON CONFLICT(id) DO UPDATE SET
       display_name = excluded.display_name,
       source_type = excluded.source_type,
       base_url = excluded.base_url,
       license_note = excluded.license_note,
       enabled = excluded.enabled,
       updated_at = excluded.updated_at`,
  )
    .bind(
      SOURCE_ID,
      SOURCE_LABEL,
      "https://fund.eastmoney.com/, https://quote.eastmoney.com/, https://finance.yahoo.com/",
      "公开网页/延迟行情来源；仅用于信息展示，后续可替换为正式授权数据源。",
      new Date().toISOString(),
    )
    .run();
}

async function persistSnapshot(env, snapshot) {
  if (!env.DB) return;
  const payloadJson = JSON.stringify(snapshot);
  await persistSource(env);
  await env.DB.prepare(
    `INSERT INTO dashboard_snapshots (as_of, generated_at, source, payload_json, checksum, is_valid)
     VALUES (?, ?, ?, ?, ?, 1)`,
  )
    .bind(snapshot.meta.asOf, snapshot.meta.generatedAt, SOURCE_LABEL, payloadJson, await checksum(payloadJson))
    .run();
}

async function dashboard(env) {
  if (!env.DB) return errorResponse(503, "DATABASE_UNAVAILABLE", "ETF database binding is not configured.");

  let row;
  try {
    row = await env.DB.prepare(
      `SELECT payload_json, as_of, generated_at, source
       FROM dashboard_snapshots
       WHERE is_valid = 1
       ORDER BY as_of DESC
       LIMIT 1`,
    ).first();
  } catch (error) {
    try {
      const liveSnapshot = await buildDashboardSnapshot();
      return json(liveSnapshot, {
        headers: {
          "cache-control": "public, max-age=60",
          "x-etf-as-of": liveSnapshot.meta.asOf,
          "x-etf-storage": "live-fallback",
        },
      });
    } catch (liveError) {
      return errorResponse(503, "DATABASE_NOT_READY", "ETF database is not initialized.", {
        reason: error.message,
        liveFallback: liveError.message,
      });
    }
  }

  if (!row) {
    try {
      const liveSnapshot = await buildDashboardSnapshot();
      await persistSnapshot(env, liveSnapshot);
      return json(liveSnapshot, {
        headers: {
          "cache-control": "public, max-age=60, stale-while-revalidate=300",
          "x-etf-as-of": liveSnapshot.meta.asOf,
        },
      });
    } catch (error) {
      return errorResponse(503, "DATA_NOT_READY", "No verified ETF snapshot is available yet.", { reason: error.message });
    }
  }

  try {
    const payload = JSON.parse(row.payload_json);
    payload.meta = {
      ...payload.meta,
      source: row.source,
      asOf: row.as_of,
      generatedAt: row.generated_at,
      version: 1,
    };
    return json(payload, {
      headers: {
        "cache-control": "public, max-age=60, stale-while-revalidate=300",
        "x-etf-as-of": row.as_of,
      },
    });
  } catch {
    return errorResponse(503, "INVALID_SNAPSHOT", "The latest ETF snapshot failed validation.");
  }
}

async function health(env) {
  let database = "unavailable";
  if (env.DB) {
    try {
      await env.DB.prepare("SELECT 1 AS ok").first();
      database = "ok";
    } catch {
      database = "not_initialized";
    }
  }
  return json({ status: database === "ok" ? "ok" : "degraded", services: { database }, checkedAt: new Date().toISOString() });
}

async function recordScheduledRun(env) {
  if (!env.DB) return;
  const startedAt = new Date().toISOString();
  let runId = null;
  try {
    await persistSource(env);
    const inserted = await env.DB.prepare(
      `INSERT INTO ingestion_runs (source_id, started_at, status)
       VALUES (?, ?, 'running') RETURNING id`,
    ).bind(SOURCE_ID, startedAt).first();
    runId = inserted?.id;
    const snapshot = await buildDashboardSnapshot();
    await persistSnapshot(env, snapshot);
    if (runId) {
      const rowsWritten = Object.values(snapshot.datasets).reduce((sum, rows) => sum + rows.length, snapshot.metrics.length);
      await env.DB.prepare(
        `UPDATE ingestion_runs
         SET finished_at = ?, status = 'success', rows_read = ?, rows_written = ?
         WHERE id = ?`,
      ).bind(new Date().toISOString(), rowsWritten, rowsWritten, runId).run();
    }
  } catch (error) {
    console.error("ETF ingestion failed", error);
    if (runId) {
      await env.DB.prepare(
        `UPDATE ingestion_runs
         SET finished_at = ?, status = 'failed', error_message = ?
         WHERE id = ?`,
      ).bind(new Date().toISOString(), error.message, runId).run();
    } else {
      await env.DB.prepare(
        `INSERT INTO ingestion_runs (source_id, started_at, finished_at, status, error_message)
         VALUES (?, ?, ?, 'failed', ?)`,
      ).bind(SOURCE_ID, startedAt, new Date().toISOString(), error.message).run();
    }
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS" && url.pathname.startsWith("/api/")) {
      return new Response(null, { status: 204, headers: { allow: "GET, HEAD, OPTIONS" } });
    }
    if (!["GET", "HEAD"].includes(request.method)) {
      return errorResponse(405, "METHOD_NOT_ALLOWED", "Only GET and HEAD are supported.", { allow: ["GET", "HEAD"] });
    }
    if (url.pathname === "/api/v1/health") return health(env);
    if (url.pathname === "/api/v1/etf/dashboard") return dashboard(env);
    if (url.pathname.startsWith("/api/")) return errorResponse(404, "NOT_FOUND", "API route not found.");
    return env.ASSETS.fetch(request);
  },

  async scheduled(_event, env, ctx) {
    ctx.waitUntil(recordScheduledRun(env));
  },
};
