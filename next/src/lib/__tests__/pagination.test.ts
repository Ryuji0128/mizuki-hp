import { describe, it, expect } from "vitest";
import { buildPageHref, buildPageItems } from "../pagination";

describe("buildPageHref", () => {
  it("1ページ目には page を付けない", () => {
    expect(buildPageHref(1)).toBe("/blog");
  });

  it("2ページ目以降は page を付ける", () => {
    expect(buildPageHref(2)).toBe("/blog?page=2");
  });

  // 実際に起きた不具合の再現テスト:
  // /blog?year=2026&month=08 で絞り込んだ状態のページ送りが /blog?page=2 になり、
  // 「2」を押すと全160句の2ページ目へ飛んでいた。
  it("年月フィルタを引き継ぐ（絞り込みが消えない）", () => {
    const href = buildPageHref(2, { year: "2026", month: "08" });
    expect(href).toContain("year=2026");
    expect(href).toContain("month=08");
    expect(href).toContain("page=2");
  });

  it("フィルタ中の1ページ目は page を付けずフィルタだけ残す", () => {
    expect(buildPageHref(1, { year: "2026", month: "08" })).toBe("/blog?year=2026&month=08");
  });

  it("year だけ / month だけの中途半端な指定は無視する", () => {
    expect(buildPageHref(2, { year: "2026" })).toBe("/blog?page=2");
    expect(buildPageHref(2, { month: "08" })).toBe("/blog?page=2");
  });

  it("basePath を差し替えられる", () => {
    expect(buildPageHref(3, { basePath: "/news" })).toBe("/news?page=3");
  });
});

describe("buildPageItems", () => {
  it("総ページ数が少なければ全部出す", () => {
    expect(buildPageItems(1, 3)).toEqual([1, 2, 3]);
  });

  // 実際に起きた不具合の再現テスト:
  // 160句 / 6句per page = 27ページ分のリンクを全て描画しており、
  // モバイルで横一列に潰れて操作できなかった。
  it("ページ数が多い時は省略する（27ページでも並びは短い）", () => {
    const items = buildPageItems(14, 27);
    expect(items).toEqual([1, null, 13, 14, 15, null, 27]);
    expect(items.length).toBeLessThan(10);
  });

  it("先頭付近では左側を省略しない", () => {
    expect(buildPageItems(1, 27)).toEqual([1, 2, null, 27]);
    expect(buildPageItems(2, 27)).toEqual([1, 2, 3, null, 27]);
  });

  it("末尾付近では右側を省略しない", () => {
    expect(buildPageItems(27, 27)).toEqual([1, null, 26, 27]);
    expect(buildPageItems(26, 27)).toEqual([1, null, 25, 26, 27]);
  });

  it("省略記号が連続しない", () => {
    const items = buildPageItems(10, 20);
    for (let i = 1; i < items.length; i++) {
      expect(items[i] === null && items[i - 1] === null).toBe(false);
    }
  });

  it("現在ページは必ず含まれる", () => {
    for (const current of [1, 5, 14, 26, 27]) {
      expect(buildPageItems(current, 27)).toContain(current);
    }
  });

  it("siblings を広げると表示件数が増える", () => {
    expect(buildPageItems(14, 27, 2)).toEqual([1, null, 12, 13, 14, 15, 16, null, 27]);
  });

  it("1ページしかない場合", () => {
    expect(buildPageItems(1, 1)).toEqual([1]);
  });

  it("0ページ（該当なし）では空", () => {
    expect(buildPageItems(1, 0)).toEqual([]);
  });
});
