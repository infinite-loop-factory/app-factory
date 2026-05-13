import type { Migration } from "./index";

export const migration001Init: Migration = {
  version: 1,
  sql: `
    CREATE TABLE tasting_notes (
      id TEXT PRIMARY KEY NOT NULL,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      score REAL,
      memo TEXT,
      price INTEGER,
      price_unit TEXT,
      date INTEGER NOT NULL,
      place_id TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE INDEX idx_tasting_notes_date ON tasting_notes(date DESC);
    CREATE INDEX idx_tasting_notes_category ON tasting_notes(category);

    CREATE TABLE tasting_note_tags (
      note_id TEXT NOT NULL,
      tag TEXT NOT NULL,
      PRIMARY KEY(note_id, tag),
      FOREIGN KEY(note_id) REFERENCES tasting_notes(id) ON DELETE CASCADE
    );
    CREATE INDEX idx_tasting_note_tags_tag ON tasting_note_tags(tag);

    CREATE TABLE tasting_note_photos (
      note_id TEXT NOT NULL,
      uri TEXT NOT NULL,
      sort_order INTEGER NOT NULL,
      PRIMARY KEY(note_id, sort_order),
      FOREIGN KEY(note_id) REFERENCES tasting_notes(id) ON DELETE CASCADE
    );

    CREATE TABLE places (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      category TEXT,
      latitude REAL,
      longitude REAL
    );
  `,
};
