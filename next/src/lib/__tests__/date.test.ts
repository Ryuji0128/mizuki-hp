import { describe, it, expect } from "vitest";
import { getJSTYearMonth, formatJSTDate } from "../date";

// 本番サーバーは UTC、俳句の表示・アーカイブ分類は JST。
// 月境界をまたぐ時刻で取り違えると、俳句が別の月のアーカイブに入る。
describe("getJSTYearMonth", () => {
  it("UTC の月末深夜は JST では翌月になる", () => {
    // 2026-07-31 16:00 UTC = 2026-08-01 01:00 JST
    expect(getJSTYearMonth("2026-07-31T16:00:00.000Z")).toEqual({ year: 2026, month: 8 });
  });

  it("UTC の月初未明は JST では前月のまま", () => {
    // 2026-08-01 00:00 UTC = 2026-08-01 09:00 JST
    expect(getJSTYearMonth("2026-08-01T00:00:00.000Z")).toEqual({ year: 2026, month: 8 });
    // 2026-07-31 14:59 UTC = 2026-07-31 23:59 JST
    expect(getJSTYearMonth("2026-07-31T14:59:00.000Z")).toEqual({ year: 2026, month: 7 });
  });

  it("年末年始の境界", () => {
    // 2025-12-31 15:00 UTC = 2026-01-01 00:00 JST
    expect(getJSTYearMonth("2025-12-31T15:00:00.000Z")).toEqual({ year: 2026, month: 1 });
    // 2025-12-31 14:59 UTC = 2025-12-31 23:59 JST
    expect(getJSTYearMonth("2025-12-31T14:59:00.000Z")).toEqual({ year: 2025, month: 12 });
  });

  it("Date オブジェクトでも文字列でも同じ結果", () => {
    const iso = "2026-08-23T12:00:00.000Z";
    expect(getJSTYearMonth(iso)).toEqual(getJSTYearMonth(new Date(iso)));
  });
});

describe("formatJSTDate", () => {
  it("JST の日付で整形する", () => {
    // 2026-07-31 16:00 UTC = 2026-08-01 JST
    expect(formatJSTDate("2026-07-31T16:00:00.000Z")).toBe("2026/8/1");
  });

  it("同日でも UTC 表記に引きずられない", () => {
    // 2026-08-23 15:30 UTC = 2026-08-24 00:30 JST
    expect(formatJSTDate("2026-08-23T15:30:00.000Z")).toBe("2026/8/24");
  });

  it("Date オブジェクトでも文字列でも同じ結果", () => {
    const iso = "2026-08-23T12:00:00.000Z";
    expect(formatJSTDate(iso)).toBe(formatJSTDate(new Date(iso)));
  });
});
