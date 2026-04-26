import { buildListQuery } from "../queries";

describe("buildListQuery", () => {
  it("empty filter — 전체 노트를 최신순으로", () => {
    const { sql, params } = buildListQuery();
    expect(sql).toBe("SELECT * FROM tasting_notes ORDER BY date DESC");
    expect(params).toEqual([]);
  });

  it("카테고리 단독 필터", () => {
    const { sql, params } = buildListQuery({ category: "whiskey" });
    expect(sql).toBe(
      "SELECT * FROM tasting_notes WHERE category = ? ORDER BY date DESC",
    );
    expect(params).toEqual(["whiskey"]);
  });

  it("점수 범위 필터", () => {
    const { sql, params } = buildListQuery({ scoreMin: 3, scoreMax: 5 });
    expect(sql).toBe(
      "SELECT * FROM tasting_notes WHERE score >= ? AND score <= ? ORDER BY date DESC",
    );
    expect(params).toEqual([3, 5]);
  });

  it("기간 필터 (dateFrom + dateTo)", () => {
    const { sql, params } = buildListQuery({
      dateFrom: 1_700_000_000_000,
      dateTo: 1_710_000_000_000,
    });
    expect(sql).toBe(
      "SELECT * FROM tasting_notes WHERE date >= ? AND date <= ? ORDER BY date DESC",
    );
    expect(params).toEqual([1_700_000_000_000, 1_710_000_000_000]);
  });

  it("텍스트 검색은 name + memo 양쪽에 LIKE 적용", () => {
    const { sql, params } = buildListQuery({ query: "bourbon" });
    expect(sql).toBe(
      "SELECT * FROM tasting_notes WHERE (name LIKE ? OR memo LIKE ?) ORDER BY date DESC",
    );
    expect(params).toEqual(["%bourbon%", "%bourbon%"]);
  });

  it("태그 다중 필터는 IN 절 + 서브쿼리", () => {
    const { sql, params } = buildListQuery({ tags: ["smoky", "peat"] });
    expect(sql).toBe(
      "SELECT * FROM tasting_notes WHERE id IN (SELECT note_id FROM tasting_note_tags WHERE tag IN (?, ?)) ORDER BY date DESC",
    );
    expect(params).toEqual(["smoky", "peat"]);
  });

  it("모든 필터 결합 — AND 로 연결되고 params 가 순서대로 누적", () => {
    const { sql, params } = buildListQuery({
      category: "whiskey",
      scoreMin: 3,
      scoreMax: 5,
      dateFrom: 1_700_000_000_000,
      dateTo: 1_710_000_000_000,
      query: "bourbon",
      tags: ["smoky"],
    });
    expect(sql).toBe(
      "SELECT * FROM tasting_notes WHERE category = ? AND score >= ? AND score <= ? AND date >= ? AND date <= ? AND (name LIKE ? OR memo LIKE ?) AND id IN (SELECT note_id FROM tasting_note_tags WHERE tag IN (?)) ORDER BY date DESC",
    );
    expect(params).toEqual([
      "whiskey",
      3,
      5,
      1_700_000_000_000,
      1_710_000_000_000,
      "%bourbon%",
      "%bourbon%",
      "smoky",
    ]);
  });
});
