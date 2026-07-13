-- Packing Lists — shared trip checklists the whole household co-edits.
--
-- Access: intentionally NO row_policies. Packing is collaborative household
-- data with no privacy or role rules: kids check off their own socks, either
-- parent edits anything, and every member may add/edit/delete items. The UI
-- implies no restriction the backend doesn't enforce (per APP_REVIEW_GUIDE
-- §4, ungoverned tables are acceptable exactly when nothing needs protecting).
--
-- `trip_date` is declared plaintext (manifest db_plaintext_columns) so lists
-- sort by date in SQL and in the AI export. `category` and `completed`-style
-- integers are already unencrypted; item names stay encrypted at rest.
CREATE TABLE IF NOT EXISTS app_packing_lists__lists (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,               -- "Maine, August"
  trip_date  TEXT NOT NULL DEFAULT '',    -- ISO YYYY-MM-DD (departure)
  notes      TEXT NOT NULL DEFAULT '',
  archived   INTEGER NOT NULL DEFAULT 0,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS app_packing_lists__items (
  id                 TEXT PRIMARY KEY,
  list_id            TEXT NOT NULL,
  name               TEXT NOT NULL,               -- "Sunscreen"
  category           TEXT NOT NULL DEFAULT 'other', -- clothes|toiletries|gear|documents|food|kids|other
  qty                INTEGER NOT NULL DEFAULT 1 CHECK (qty > 0),
  assigned_member_id TEXT NOT NULL DEFAULT '',    -- who packs it ('' = anyone)
  packed             INTEGER NOT NULL DEFAULT 0,
  packed_by          TEXT NOT NULL DEFAULT '',
  sort_order         INTEGER NOT NULL DEFAULT 0,
  created_by         TEXT NOT NULL,
  created_at         TEXT NOT NULL,
  FOREIGN KEY (list_id) REFERENCES app_packing_lists__lists(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS app_packing_lists__items_list_idx
  ON app_packing_lists__items (list_id, category, sort_order);

CREATE INDEX IF NOT EXISTS app_packing_lists__lists_date_idx
  ON app_packing_lists__lists (archived, trip_date);
