const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
};

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { ...JSON_HEADERS, ...(init.headers || {}) },
  });
}

function errorResponse(status, code, message, details) {
  return json({ error: { code, message, ...(details ? { details } : {}) } }, { status });
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
    return errorResponse(503, "DATABASE_NOT_READY", "ETF database is not initialized.");
  }

  if (!row) {
    return errorResponse(503, "DATA_NOT_READY", "No verified ETF snapshot is available yet.");
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
  try {
    await env.DB.prepare(
      `INSERT INTO ingestion_runs (source_id, started_at, finished_at, status, error_message)
       VALUES (NULL, ?, ?, 'skipped', 'No licensed data source configured')`,
    ).bind(new Date().toISOString(), new Date().toISOString()).run();
  } catch (error) {
    console.error("Unable to record scheduled ETF run", error);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS" && url.pathname.startsWith("/api/")) {
      return new Response(null, { status: 204, headers: { "allow": "GET, HEAD, OPTIONS" } });
    }
    if (!["GET", "HEAD"].includes(request.method)) {
      return errorResponse(405, "METHOD_NOT_ALLOWED", "Only GET and HEAD are supported.", { allow: ["GET", "HEAD"] });
    }
    if (url.pathname === "/api/v1/health") return health(env);
    if (url.pathname === "/api/v1/etf/dashboard") return dashboard(env);
    if (url.pathname.startsWith("/api/")) return errorResponse(404, "NOT_FOUND", "API route not found.");
    return errorResponse(404, "NOT_FOUND", "This Worker only serves the /api namespace.");
  },

  async scheduled(_event, env, ctx) {
    ctx.waitUntil(recordScheduledRun(env));
  },
};
