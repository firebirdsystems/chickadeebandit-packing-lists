/**
 * Pure business logic for the Packing Lists app.
 * No DOM, no fetch — importable in both browser and test environments.
 */

export const CATEGORIES = [
  { value: "clothes",    label: "Clothes",    icon: "👕" },
  { value: "toiletries", label: "Toiletries", icon: "🪥" },
  { value: "gear",       label: "Gear",       icon: "🎒" },
  { value: "documents",  label: "Documents",  icon: "🛂" },
  { value: "food",       label: "Food",       icon: "🥨" },
  { value: "kids",       label: "Kids",       icon: "🧸" },
  { value: "other",      label: "Other",      icon: "📦" },
];

const CAT_BY_VALUE = new Map(CATEGORIES.map((c) => [c.value, c]));

export function categoryMeta(v) {
  return CAT_BY_VALUE.get(v) ?? { value: "other", label: "Other", icon: "📦" };
}

/** Starter templates: [{ name, category, qty? }]. */
export const TEMPLATES = {
  weekend: {
    label: "Weekend away",
    items: [
      { name: "Clothes for 2 days", category: "clothes" },
      { name: "Pajamas", category: "clothes" },
      { name: "Toothbrush & toothpaste", category: "toiletries" },
      { name: "Phone charger", category: "gear" },
      { name: "Medications", category: "toiletries" },
    ],
  },
  beach: {
    label: "Beach trip",
    items: [
      { name: "Swimsuits", category: "clothes" },
      { name: "Sunscreen", category: "toiletries" },
      { name: "Beach towels", category: "gear" },
      { name: "Sunglasses & hats", category: "clothes" },
      { name: "Sand toys", category: "kids" },
      { name: "Cooler snacks", category: "food" },
    ],
  },
  camping: {
    label: "Camping",
    items: [
      { name: "Tent", category: "gear" },
      { name: "Sleeping bags", category: "gear" },
      { name: "Headlamps", category: "gear" },
      { name: "Bug spray", category: "toiletries" },
      { name: "First-aid kit", category: "gear" },
      { name: "Marshmallows", category: "food" },
    ],
  },
  flight: {
    label: "Flying somewhere",
    items: [
      { name: "Passports / IDs", category: "documents" },
      { name: "Boarding passes", category: "documents" },
      { name: "Headphones", category: "gear" },
      { name: "Empty water bottles", category: "gear" },
      { name: "Snacks for the plane", category: "food" },
      { name: "Entertainment for kids", category: "kids" },
    ],
  },
};

/** Progress { packed, total, pct } for a list's items. */
export function progress(items) {
  const total = items.length;
  const packed = items.filter((i) => Number(i.packed)).length;
  return { packed, total, pct: total ? Math.round((packed / total) * 100) : 0 };
}

/** Items grouped by category in canonical order: [{ category, meta, items }]. */
export function groupByCategory(items) {
  const groups = [];
  for (const cat of CATEGORIES) {
    const inCat = items
      .filter((i) => (CAT_BY_VALUE.has(i.category) ? i.category : "other") === cat.value)
      .sort((a, b) => Number(a.packed) - Number(b.packed)
        || (Number(a.sort_order) - Number(b.sort_order))
        || String(a.name).localeCompare(String(b.name)));
    if (inCat.length) groups.push({ category: cat.value, meta: cat, items: inCat });
  }
  return groups;
}

/** Lists sorted: active upcoming trips by date first, undated after, archived out. */
export function sortedLists(lists) {
  return lists
    .filter((l) => !Number(l.archived))
    .sort((a, b) => {
      const da = a.trip_date || "9999";
      const db = b.trip_date || "9999";
      return String(da).localeCompare(String(db)) || String(a.title).localeCompare(String(b.title));
    });
}

/** "In 12 days" style countdown to the trip date; empty when unset/past. */
export function tripCountdown(iso, from = new Date()) {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  const midnight = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate());
  const days = Math.round((midnight(d) - midnight(from)) / 86400000);
  if (days < 0) return "";
  if (days === 0) return "Today!";
  if (days === 1) return "Tomorrow";
  if (days < 30) return `In ${days} days`;
  return `In ${Math.round(days / 7)} weeks`;
}
