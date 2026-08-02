-- Automation support for the `create_list` action.
--
-- `source_event_id` records which app event produced the row. The dispatcher's
-- dedupe guard matches on it (SELECT 1 FROM ... WHERE source_event_id = ?
-- LIMIT 1), so a trip event redelivered by a retry reuses the list that already
-- exists instead of creating a second one.
--
-- Nullable on purpose: lists created by hand have no source event, and the
-- guard only ever looks for a specific non-null id.
ALTER TABLE app_packing_lists__lists ADD COLUMN source_event_id TEXT;

CREATE INDEX IF NOT EXISTS app_packing_lists__idx_lists_source_event_id
  ON app_packing_lists__lists(source_event_id);
