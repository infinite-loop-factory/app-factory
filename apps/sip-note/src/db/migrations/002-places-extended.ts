import type { Migration } from "./index";

export const migration002PlacesExtended: Migration = {
  version: 2,
  sql: `
    ALTER TABLE places ADD COLUMN address TEXT;
    ALTER TABLE places ADD COLUMN is_wishlist INTEGER NOT NULL DEFAULT 0;
    ALTER TABLE places ADD COLUMN visit_count INTEGER NOT NULL DEFAULT 0;
    ALTER TABLE places ADD COLUMN created_at INTEGER NOT NULL DEFAULT 0;
    ALTER TABLE places ADD COLUMN updated_at INTEGER NOT NULL DEFAULT 0;
    CREATE INDEX IF NOT EXISTS idx_places_category ON places(category);
    CREATE INDEX IF NOT EXISTS idx_places_is_wishlist ON places(is_wishlist);
  `,
};
