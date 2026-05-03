import { buildListQuery } from "../queries";

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
