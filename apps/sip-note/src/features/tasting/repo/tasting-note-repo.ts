import type { TastingNoteRow } from "@/db/schema";
import type { TastingNote, TastingNoteFilter, TastingNoteInput } from "./types";

import { getDb } from "@/db/client";
import { buildListQuery } from "./queries";

function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function rowToNote(
  row: TastingNoteRow,
  tags: string[],
  photos: string[],
): TastingNote {
  return {
    id: row.id,
    category: row.category,
    name: row.name,
    score: row.score,
    memo: row.memo,
    price: row.price,
    priceUnit: row.price_unit,
    date: row.date,
    placeId: row.place_id,
    tags,
    photos,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function fetchTagsByNoteIds(
  noteIds: string[],
): Promise<Map<string, string[]>> {
  if (noteIds.length === 0) return new Map();
  const db = await getDb();
  const placeholders = noteIds.map(() => "?").join(", ");
  const rows = await db.getAllAsync<{ note_id: string; tag: string }>(
    `SELECT note_id, tag FROM tasting_note_tags WHERE note_id IN (${placeholders})`,
    ...noteIds,
  );
  const map = new Map<string, string[]>();
  for (const row of rows) {
    const arr = map.get(row.note_id) ?? [];
    arr.push(row.tag);
    map.set(row.note_id, arr);
  }
  return map;
}

async function fetchPhotosByNoteIds(
  noteIds: string[],
): Promise<Map<string, string[]>> {
  if (noteIds.length === 0) return new Map();
  const db = await getDb();
  const placeholders = noteIds.map(() => "?").join(", ");
  const rows = await db.getAllAsync<{
    note_id: string;
    uri: string;
    sort_order: number;
  }>(
    `SELECT note_id, uri, sort_order FROM tasting_note_photos WHERE note_id IN (${placeholders}) ORDER BY note_id, sort_order`,
    ...noteIds,
  );
  const map = new Map<string, string[]>();
  for (const row of rows) {
    const arr = map.get(row.note_id) ?? [];
    arr.push(row.uri);
    map.set(row.note_id, arr);
  }
  return map;
}

async function insertTagsAndPhotos(
  id: string,
  tags: string[] | undefined,
  photos: string[] | undefined,
): Promise<void> {
  const db = await getDb();
  if (tags?.length) {
    for (const tag of tags) {
      await db.runAsync(
        "INSERT OR IGNORE INTO tasting_note_tags (note_id, tag) VALUES (?, ?)",
        id,
        tag,
      );
    }
  }
  if (photos?.length) {
    for (let i = 0; i < photos.length; i++) {
      await db.runAsync(
        "INSERT INTO tasting_note_photos (note_id, uri, sort_order) VALUES (?, ?, ?)",
        id,
        photos[i],
        i,
      );
    }
  }
}

export async function create(input: TastingNoteInput): Promise<TastingNote> {
  const db = await getDb();
  const id = generateId();
  const now = Date.now();

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT INTO tasting_notes
        (id, category, name, score, memo, price, price_unit, date, place_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      input.category,
      input.name,
      input.score ?? null,
      input.memo ?? null,
      input.price ?? null,
      input.priceUnit ?? null,
      input.date,
      input.placeId ?? null,
      now,
      now,
    );
    await insertTagsAndPhotos(id, input.tags, input.photos);
  });

  const note = await get(id);
  if (!note) throw new Error(`Failed to load created note ${id}`);
  return note;
}

export async function get(id: string): Promise<TastingNote | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<TastingNoteRow>(
    "SELECT * FROM tasting_notes WHERE id = ?",
    id,
  );
  if (!row) return null;
  const [tagsMap, photosMap] = await Promise.all([
    fetchTagsByNoteIds([id]),
    fetchPhotosByNoteIds([id]),
  ]);
  return rowToNote(row, tagsMap.get(id) ?? [], photosMap.get(id) ?? []);
}

export async function update(
  id: string,
  input: TastingNoteInput,
): Promise<TastingNote> {
  const db = await getDb();
  const now = Date.now();

  await db.withTransactionAsync(async () => {
    const result = await db.runAsync(
      `UPDATE tasting_notes
       SET category = ?, name = ?, score = ?, memo = ?, price = ?, price_unit = ?,
           date = ?, place_id = ?, updated_at = ?
       WHERE id = ?`,
      input.category,
      input.name,
      input.score ?? null,
      input.memo ?? null,
      input.price ?? null,
      input.priceUnit ?? null,
      input.date,
      input.placeId ?? null,
      now,
      id,
    );
    if (result.changes === 0) {
      throw new Error(`Tasting note not found: ${id}`);
    }
    await db.runAsync("DELETE FROM tasting_note_tags WHERE note_id = ?", id);
    await db.runAsync("DELETE FROM tasting_note_photos WHERE note_id = ?", id);
    await insertTagsAndPhotos(id, input.tags, input.photos);
  });

  const note = await get(id);
  if (!note) throw new Error(`Failed to load updated note ${id}`);
  return note;
}

export async function remove(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync("DELETE FROM tasting_notes WHERE id = ?", id);
}

export async function list(
  filter: TastingNoteFilter = {},
): Promise<TastingNote[]> {
  const db = await getDb();
  const { sql, params } = buildListQuery(filter);
  const rows = await db.getAllAsync<TastingNoteRow>(sql, ...params);
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);
  const [tagsMap, photosMap] = await Promise.all([
    fetchTagsByNoteIds(ids),
    fetchPhotosByNoteIds(ids),
  ]);
  return rows.map((row) =>
    rowToNote(row, tagsMap.get(row.id) ?? [], photosMap.get(row.id) ?? []),
  );
}
