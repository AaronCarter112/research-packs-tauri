PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  translate INTEGER DEFAULT 1,
  extractive INTEGER DEFAULT 0,
  scheduled INTEGER DEFAULT 0,
  export_folder TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  video_id TEXT, video_url TEXT, title TEXT,
  channel_name TEXT, channel_url TEXT,
  publish_date TEXT, duration INTEGER,
  category TEXT, tags TEXT,
  language TEXT, translated INTEGER DEFAULT 0,
  summary_short TEXT, summary_long TEXT,
  key_points TEXT, timecoded_points TEXT,
  entities_people TEXT, entities_orgs TEXT, entities_places TEXT,
  entity_confidence_scores TEXT,
  external_links TEXT, citations TEXT,
  processing_date TEXT, tool_version TEXT,
  status TEXT DEFAULT 'ok', error TEXT,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  started_at TEXT DEFAULT (datetime('now')),
  finished_at TEXT, status TEXT DEFAULT 'queued', notes TEXT,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
