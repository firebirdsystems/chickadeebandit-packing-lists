-- AI read export: items not yet packed, grouped by list.
SELECT
  id,
  list_id,
  name,
  category,
  qty,
  assigned_member_id
FROM app_packing_lists__items
WHERE packed = 0
ORDER BY list_id, category, sort_order
LIMIT 500
