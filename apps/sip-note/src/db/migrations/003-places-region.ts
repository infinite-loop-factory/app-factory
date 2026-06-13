import type { Migration } from "./index";

export const migration003PlacesRegion: Migration = {
  version: 3,
  sql: `
    ALTER TABLE places ADD COLUMN city TEXT;
    ALTER TABLE places ADD COLUMN region TEXT;
    CREATE INDEX IF NOT EXISTS idx_places_city ON places(city);
    CREATE INDEX IF NOT EXISTS idx_places_region ON places(region);
  `,
};
