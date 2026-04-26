import type { TastingNoteFilter } from "./types";

export function buildListQuery(filter: TastingNoteFilter = {}): {
  sql: string;
  params: unknown[];
} {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filter.category) {
    conditions.push("category = ?");
    params.push(filter.category);
  }
  if (filter.scoreMin !== undefined) {
    conditions.push("score >= ?");
    params.push(filter.scoreMin);
  }
  if (filter.scoreMax !== undefined) {
    conditions.push("score <= ?");
    params.push(filter.scoreMax);
  }
  if (filter.dateFrom !== undefined) {
    conditions.push("date >= ?");
    params.push(filter.dateFrom);
  }
  if (filter.dateTo !== undefined) {
    conditions.push("date <= ?");
    params.push(filter.dateTo);
  }
  if (filter.query) {
    conditions.push("(name LIKE ? OR memo LIKE ?)");
    const like = `%${filter.query}%`;
    params.push(like, like);
  }
  if (filter.tags && filter.tags.length > 0) {
    const placeholders = filter.tags.map(() => "?").join(", ");
    conditions.push(
      `id IN (SELECT note_id FROM tasting_note_tags WHERE tag IN (${placeholders}))`,
    );
    params.push(...filter.tags);
  }

  const where =
    conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";
  const sql = `SELECT * FROM tasting_notes${where} ORDER BY date DESC`;

  return { sql, params };
}
