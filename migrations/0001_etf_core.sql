PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS dashboard_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  as_of TEXT NOT NULL,
  generated_at TEXT NOT NULL,
  source TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  checksum TEXT,
  is_valid INTEGER NOT NULL DEFAULT 1 CHECK (is_valid IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS dashboard_snapshots_latest
  ON dashboard_snapshots (is_valid, as_of DESC);

CREATE TABLE IF NOT EXISTS data_sources (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  source_type TEXT NOT NULL,
  base_url TEXT,
  license_note TEXT,
  enabled INTEGER NOT NULL DEFAULT 0 CHECK (enabled IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS ingestion_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_id TEXT,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  status TEXT NOT NULL CHECK (status IN ('running', 'success', 'failed', 'skipped')),
  rows_read INTEGER NOT NULL DEFAULT 0,
  rows_written INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  FOREIGN KEY (source_id) REFERENCES data_sources(id)
);

CREATE INDEX IF NOT EXISTS ingestion_runs_recent
  ON ingestion_runs (started_at DESC);

CREATE TABLE IF NOT EXISTS funds (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('onExchange', 'nasdaq', 'sp500', 'active')),
  tracking_index TEXT,
  purchase_status TEXT CHECK (purchase_status IN ('open', 'limited', 'suspended') OR purchase_status IS NULL),
  daily_limit TEXT,
  metadata_as_of TEXT NOT NULL,
  source_id TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (source_id) REFERENCES data_sources(id)
);

CREATE TABLE IF NOT EXISTS fund_observations (
  fund_code TEXT NOT NULL,
  observed_at TEXT NOT NULL,
  nav_date TEXT,
  price_date TEXT,
  scale_cny_100m REAL,
  return_1y_pct REAL,
  market_change_pct REAL,
  premium_pct REAL,
  turnover_cny_100m REAL,
  tracking_error_pct REAL,
  fee_rate_pct REAL,
  source_id TEXT NOT NULL,
  PRIMARY KEY (fund_code, observed_at),
  FOREIGN KEY (fund_code) REFERENCES funds(code),
  FOREIGN KEY (source_id) REFERENCES data_sources(id)
);

CREATE INDEX IF NOT EXISTS fund_observations_latest
  ON fund_observations (fund_code, observed_at DESC);

CREATE TABLE IF NOT EXISTS market_metrics (
  metric_id TEXT NOT NULL,
  label TEXT NOT NULL,
  value REAL,
  display_value TEXT,
  change_pct REAL,
  note TEXT,
  observed_at TEXT NOT NULL,
  source_id TEXT NOT NULL,
  PRIMARY KEY (metric_id, observed_at),
  FOREIGN KEY (source_id) REFERENCES data_sources(id)
);
