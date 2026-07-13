import { describe, it, expect } from "vitest";
import {
  categoryMeta, TEMPLATES, progress, groupByCategory, sortedLists, tripCountdown,
} from "../src/logic.js";

const FROM = new Date(2026, 6, 12, 9, 0, 0); // July 12, 2026 local

describe("progress", () => {
  it("counts packed vs total with pct", () => {
    expect(progress([{ packed: 1 }, { packed: 0 }, { packed: 1 }])).toEqual({ packed: 2, total: 3, pct: 67 });
    expect(progress([])).toEqual({ packed: 0, total: 0, pct: 0 });
  });
});

describe("groupByCategory", () => {
  it("groups in canonical order, unpacked before packed", () => {
    const items = [
      { id: "a", category: "gear", packed: 1, sort_order: 0, name: "Tent" },
      { id: "b", category: "clothes", packed: 0, sort_order: 0, name: "Socks" },
      { id: "c", category: "gear", packed: 0, sort_order: 1, name: "Lamp" },
      { id: "d", category: "mystery", packed: 0, sort_order: 0, name: "Thing" },
    ];
    const groups = groupByCategory(items);
    expect(groups.map((g) => g.category)).toEqual(["clothes", "gear", "other"]);
    expect(groups[1].items.map((i) => i.id)).toEqual(["c", "a"]);
    expect(groups[2].items[0].id).toBe("d"); // unknown category lands in other
  });
});

describe("sortedLists", () => {
  it("sorts dated lists first by date, hides archived", () => {
    const lists = [
      { id: "undated", title: "Someday", trip_date: "", archived: 0 },
      { id: "soon", title: "Beach", trip_date: "2026-08-01", archived: 0 },
      { id: "old", title: "Done", trip_date: "2026-01-01", archived: 1 },
    ];
    expect(sortedLists(lists).map((l) => l.id)).toEqual(["soon", "undated"]);
  });
});

describe("tripCountdown", () => {
  it("labels upcoming departures and hides past/blank ones", () => {
    expect(tripCountdown("2026-07-12", FROM)).toBe("Today!");
    expect(tripCountdown("2026-07-13", FROM)).toBe("Tomorrow");
    expect(tripCountdown("2026-07-20", FROM)).toBe("In 8 days");
    expect(tripCountdown("2026-07-01", FROM)).toBe("");
    expect(tripCountdown("", FROM)).toBe("");
  });
});

describe("templates", () => {
  it("every template item uses a known category", () => {
    for (const t of Object.values(TEMPLATES)) {
      for (const item of t.items) {
        expect(categoryMeta(item.category).value).toBe(item.category);
      }
    }
  });
});
