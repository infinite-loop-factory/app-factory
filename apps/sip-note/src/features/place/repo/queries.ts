import type { PlaceFilter } from "./types";

export function buildListQuery(filter: PlaceFilter = {}): {
  sql: string;
  params: unknown[];
} {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filter.category) {
    conditions.push("category = ?");
    params.push(filter.category);
  }
  if (filter.isWishlist !== undefined) {
    conditions.push("is_wishlist = ?");
    params.push(filter.isWishlist ? 1 : 0);
  }
  if (filter.query) {
    conditions.push("(name LIKE ? OR address LIKE ?)");
    const like = `%${filter.query}%`;
    params.push(like, like);
  }
  if (filter.bounds) {
    conditions.push("latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?");
    params.push(
      filter.bounds.minLat,
      filter.bounds.maxLat,
      filter.bounds.minLng,
      filter.bounds.maxLng,
    );
  }

  const where =
    conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";
  const sql = `SELECT * FROM places${where} ORDER BY visit_count DESC, name ASC`;

  return { sql, params };
}
