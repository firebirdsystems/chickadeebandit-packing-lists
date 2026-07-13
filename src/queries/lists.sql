-- AI read export: active packing lists ordered by trip date.
-- The tables are ungoverned household-shared data, so no member_id is needed.
-- trip_date is declared in db_plaintext_columns.
SELECT
  id,
  title,
  trip_date,
  notes
FROM app_packing_lists__lists
WHERE archived = 0
ORDER BY (trip_date = ''), trip_date
LIMIT 100
