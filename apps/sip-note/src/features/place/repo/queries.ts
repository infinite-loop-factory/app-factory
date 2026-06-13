import type { PlaceFilter, StatsFilter } from "./types";

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

const NOTE_COUNT_JOIN =
  " LEFT JOIN (SELECT place_id, COUNT(*) AS cnt FROM tasting_notes" +
  " WHERE place_id IS NOT NULL GROUP BY place_id) tn ON tn.place_id = p.id";

function buildStatsConditions(
  filter: StatsFilter,
  groupColumn: "city" | "region" | null,
): { where: string; params: unknown[] } {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filter.category) {
    conditions.push("p.category = ?");
    params.push(filter.category);
  }
  if (filter.isWishlist !== undefined) {
    conditions.push("p.is_wishlist = ?");
    params.push(filter.isWishlist ? 1 : 0);
  }
  if (groupColumn && filter.includeUnknown === false) {
    conditions.push(`p.${groupColumn} IS NOT NULL`);
  }

  const where =
    conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";
  return { where, params };
}

export function buildCityVisitStatsQuery(filter: StatsFilter = {}): {
  sql: string;
  params: unknown[];
} {
  const { where, params } = buildStatsConditions(filter, "city");
  const sql =
    "SELECT p.city AS city," +
    " COUNT(*) AS place_count," +
    " COALESCE(SUM(p.visit_count), 0) AS visit_count," +
    " COALESCE(SUM(tn.cnt), 0) AS note_count" +
    ` FROM places p${NOTE_COUNT_JOIN}${where}` +
    " GROUP BY p.city" +
    " ORDER BY visit_count DESC, p.city ASC";
  return { sql, params };
}

export function buildRegionVisitStatsQuery(filter: StatsFilter = {}): {
  sql: string;
  params: unknown[];
} {
  const { where, params } = buildStatsConditions(filter, "region");
  const sql =
    "SELECT p.region AS region," +
    " COUNT(*) AS place_count," +
    " COALESCE(SUM(p.visit_count), 0) AS visit_count," +
    " COALESCE(SUM(tn.cnt), 0) AS note_count" +
    ` FROM places p${NOTE_COUNT_JOIN}${where}` +
    " GROUP BY p.region" +
    " ORDER BY visit_count DESC, p.region ASC";
  return { sql, params };
}

export function buildPlaceVisitStatsQuery(filter: StatsFilter = {}): {
  sql: string;
  params: unknown[];
} {
  const { where, params } = buildStatsConditions(filter, null);
  const sql =
    "SELECT p.id AS id, p.name AS name, p.category AS category," +
    " p.city AS city, p.region AS region," +
    " p.visit_count AS visit_count," +
    " COALESCE(tn.cnt, 0) AS note_count" +
    ` FROM places p${NOTE_COUNT_JOIN}${where}` +
    " ORDER BY p.visit_count DESC, p.name ASC";
  return { sql, params };
}

export function buildVisitTotalsQuery(filter: StatsFilter = {}): {
  sql: string;
  params: unknown[];
} {
  const { where, params } = buildStatsConditions(filter, null);
  const sql =
    "SELECT" +
    " COUNT(DISTINCT p.city) AS total_cities," +
    " COUNT(DISTINCT p.region) AS total_regions," +
    " COUNT(*) AS total_places," +
    " COALESCE(SUM(p.visit_count), 0) AS total_visits," +
    " COALESCE(SUM(tn.cnt), 0) AS total_notes" +
    ` FROM places p${NOTE_COUNT_JOIN}${where}`;
  return { sql, params };
}
