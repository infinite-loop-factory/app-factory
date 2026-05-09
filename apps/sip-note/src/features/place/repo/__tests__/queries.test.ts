import {
  buildCityVisitStatsQuery,
  buildListQuery,
  buildPlaceVisitStatsQuery,
  buildRegionVisitStatsQuery,
  buildVisitTotalsQuery,
} from "../queries";

describe("placeQueries.buildListQuery", () => {
  it("빈 필터 — 전체 장소를 visit_count desc / name asc 순으로", () => {
    const { sql, params } = buildListQuery();
    expect(sql).toBe(
      "SELECT * FROM places ORDER BY visit_count DESC, name ASC",
    );
    expect(params).toEqual([]);
  });

  it("카테고리 단독 필터", () => {
    const { sql, params } = buildListQuery({ category: "winery" });
    expect(sql).toContain("WHERE category = ?");
    expect(params).toEqual(["winery"]);
  });

  it("isWishlist 필터는 boolean → 0/1", () => {
    const wish = buildListQuery({ isWishlist: true });
    expect(wish.params).toEqual([1]);
    const visited = buildListQuery({ isWishlist: false });
    expect(visited.params).toEqual([0]);
  });

  it("query 텍스트는 name + address 양쪽에 LIKE", () => {
    const { sql, params } = buildListQuery({ query: "glas" });
    expect(sql).toContain("(name LIKE ? OR address LIKE ?)");
    expect(params).toEqual(["%glas%", "%glas%"]);
  });

  it("bounds 필터는 BETWEEN 4 params", () => {
    const { sql, params } = buildListQuery({
      bounds: { minLat: 30, maxLat: 40, minLng: 120, maxLng: 130 },
    });
    expect(sql).toContain(
      "latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?",
    );
    expect(params).toEqual([30, 40, 120, 130]);
  });

  it("모든 필터 결합 — AND 로 연결되고 params 누적", () => {
    const { sql, params } = buildListQuery({
      category: "bar",
      isWishlist: false,
      query: "hope",
      bounds: { minLat: 30, maxLat: 40, minLng: 120, maxLng: 130 },
    });
    expect(sql).toBe(
      "SELECT * FROM places WHERE category = ? AND is_wishlist = ? AND (name LIKE ? OR address LIKE ?) AND latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ? ORDER BY visit_count DESC, name ASC",
    );
    expect(params).toEqual(["bar", 0, "%hope%", "%hope%", 30, 40, 120, 130]);
  });
});

describe("placeQueries.buildCityVisitStatsQuery", () => {
  it("기본 — GROUP BY city + tasting_notes derived join", () => {
    const { sql, params } = buildCityVisitStatsQuery();
    expect(sql).toContain("FROM places p");
    expect(sql).toContain(
      "LEFT JOIN (SELECT place_id, COUNT(*) AS cnt FROM tasting_notes",
    );
    expect(sql).toContain("GROUP BY p.city");
    expect(sql).toContain("ORDER BY visit_count DESC, p.city ASC");
    expect(params).toEqual([]);
  });

  it("includeUnknown=false 면 city IS NOT NULL 분기", () => {
    const { sql, params } = buildCityVisitStatsQuery({ includeUnknown: false });
    expect(sql).toContain("p.city IS NOT NULL");
    expect(params).toEqual([]);
  });

  it("category + isWishlist 결합 → params 순서대로 누적", () => {
    const { sql, params } = buildCityVisitStatsQuery({
      category: "winery",
      isWishlist: true,
    });
    expect(sql).toContain("p.category = ?");
    expect(sql).toContain("p.is_wishlist = ?");
    expect(params).toEqual(["winery", 1]);
  });
});

describe("placeQueries.buildRegionVisitStatsQuery", () => {
  it("GROUP BY region + region IS NOT NULL 분기", () => {
    const { sql, params } = buildRegionVisitStatsQuery({
      includeUnknown: false,
    });
    expect(sql).toContain("GROUP BY p.region");
    expect(sql).toContain("p.region IS NOT NULL");
    expect(params).toEqual([]);
  });
});

describe("placeQueries.buildPlaceVisitStatsQuery", () => {
  it("place 단위 — GROUP BY 없이 row 별 visit/note count", () => {
    const { sql, params } = buildPlaceVisitStatsQuery();
    expect(sql).toContain("p.id AS id");
    expect(sql).toContain("p.visit_count AS visit_count");
    expect(sql).toContain("COALESCE(tn.cnt, 0) AS note_count");
    expect(sql).not.toContain("GROUP BY p.");
    expect(sql).toContain("ORDER BY p.visit_count DESC, p.name ASC");
    expect(params).toEqual([]);
  });

  it("includeUnknown 옵션은 place 단위에서는 무시 (city/region 분기 없음)", () => {
    const { sql } = buildPlaceVisitStatsQuery({ includeUnknown: false });
    expect(sql).not.toContain("p.city IS NOT NULL");
    expect(sql).not.toContain("p.region IS NOT NULL");
  });

  it("category 필터는 적용", () => {
    const { params } = buildPlaceVisitStatsQuery({ category: "bar" });
    expect(params).toEqual(["bar"]);
  });
});

describe("placeQueries.buildVisitTotalsQuery", () => {
  it("단일 row 에 totals 5 종 — GROUP BY 없음", () => {
    const { sql, params } = buildVisitTotalsQuery();
    expect(sql).toContain("COUNT(DISTINCT p.city) AS total_cities");
    expect(sql).toContain("COUNT(DISTINCT p.region) AS total_regions");
    expect(sql).toContain("COUNT(*) AS total_places");
    expect(sql).toContain("COALESCE(SUM(p.visit_count), 0) AS total_visits");
    expect(sql).toContain("COALESCE(SUM(tn.cnt), 0) AS total_notes");
    expect(sql).not.toContain("GROUP BY p.");
    expect(params).toEqual([]);
  });

  it("isWishlist 필터 결합", () => {
    const { params } = buildVisitTotalsQuery({ isWishlist: false });
    expect(params).toEqual([0]);
  });
});
