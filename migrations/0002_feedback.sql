CREATE TABLE IF NOT EXISTS feedback_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('suggestion', 'bug', 'content', 'other')),
  message TEXT NOT NULL,
  contact TEXT,
  page_url TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'resolved', 'archived')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS feedback_submissions_recent
  ON feedback_submissions (created_at DESC);
