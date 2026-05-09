import type { PlaceRow } from "@/db/schema";
import type {
  CityVisitStat,
  Place,
  PlaceFilter,
  PlaceInput,
  PlaceVisitStat,
  RegionVisitStat,
  StatsFilter,
  VisitTotals,
} from "./types";

import { getDb } from "@/db/client";
import {
  buildCityVisitStatsQuery,
  buildListQuery,
  buildPlaceVisitStatsQuery,
  buildRegionVisitStatsQuery,
  buildVisitTotalsQuery,
} from "./queries";

function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function rowToPlace(row: PlaceRow): Place {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    latitude: row.latitude,
    longitude: row.longitude,
    address: row.address,
    city: row.city,
    region: row.region,
    isWishlist: row.is_wishlist === 1,
    visitCount: row.visit_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function create(input: PlaceInput): Promise<Place> {
  const db = await getDb();
  const id = generateId();
  const now = Date.now();

  await db.runAsync(
    `INSERT INTO places
      (id, name, category, latitude, longitude, address, city, region, is_wishlist, visit_count, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
    id,
    input.name,
    input.category ?? null,
    input.latitude ?? null,
    input.longitude ?? null,
    input.address ?? null,
    input.city ?? null,
    input.region ?? null,
    input.isWishlist ? 1 : 0,
    now,
    now,
  );

  const place = await get(id);
  if (!place) throw new Error(`Failed to load created place ${id}`);
  return place;
}

export async function get(id: string): Promise<Place | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<PlaceRow>(
    "SELECT * FROM places WHERE id = ?",
    id,
  );
  return row ? rowToPlace(row) : null;
}

export async function update(id: string, input: PlaceInput): Promise<Place> {
  const db = await getDb();
  const now = Date.now();

  const result = await db.runAsync(
    `UPDATE places
     SET name = ?, category = ?, latitude = ?, longitude = ?, address = ?, city = ?, region = ?, is_wishlist = ?, updated_at = ?
     WHERE id = ?`,
    input.name,
    input.category ?? null,
    input.latitude ?? null,
    input.longitude ?? null,
    input.address ?? null,
    input.city ?? null,
    input.region ?? null,
    input.isWishlist ? 1 : 0,
    now,
    id,
  );
  if (result.changes === 0) {
    throw new Error(`Place not found: ${id}`);
  }

  const place = await get(id);
  if (!place) throw new Error(`Failed to load updated place ${id}`);
  return place;
}

export async function remove(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync("DELETE FROM places WHERE id = ?", id);
}

export async function list(filter: PlaceFilter = {}): Promise<Place[]> {
  const db = await getDb();
  const { sql, params } = buildListQuery(filter);
  const rows = await db.getAllAsync<PlaceRow>(sql, ...params);
  return rows.map(rowToPlace);
}

export async function toggleWishlist(id: string): Promise<Place> {
  const db = await getDb();
  const now = Date.now();
  const result = await db.runAsync(
    `UPDATE places
     SET is_wishlist = CASE is_wishlist WHEN 1 THEN 0 ELSE 1 END,
         updated_at = ?
     WHERE id = ?`,
    now,
    id,
  );
  if (result.changes === 0) {
    throw new Error(`Place not found: ${id}`);
  }
  const place = await get(id);
  if (!place) throw new Error(`Failed to load place ${id}`);
  return place;
}

export async function incrementVisitCount(id: string): Promise<void> {
  const db = await getDb();
  const now = Date.now();
  const result = await db.runAsync(
    `UPDATE places
     SET visit_count = visit_count + 1, updated_at = ?
     WHERE id = ?`,
    now,
    id,
  );
  if (result.changes === 0) {
    throw new Error(`Place not found: ${id}`);
  }
}

type CityStatRow = {
  city: string | null;
  place_count: number;
  visit_count: number;
  note_count: number;
};

type RegionStatRow = {
  region: string | null;
  place_count: number;
  visit_count: number;
  note_count: number;
};

type PlaceStatRow = {
  id: string;
  name: string;
  category: PlaceRow["category"];
  city: string | null;
  region: string | null;
  visit_count: number;
  note_count: number;
};

type TotalsRow = {
  total_cities: number;
  total_regions: number;
  total_places: number;
  total_visits: number;
  total_notes: number;
};

export async function listCityVisitStats(
  filter: StatsFilter = {},
): Promise<CityVisitStat[]> {
  const db = await getDb();
  const { sql, params } = buildCityVisitStatsQuery(filter);
  const rows = await db.getAllAsync<CityStatRow>(sql, ...params);
  return rows.map((row) => ({
    city: row.city,
    placeCount: row.place_count,
    visitCount: row.visit_count,
    noteCount: row.note_count,
  }));
}

export async function listRegionVisitStats(
  filter: StatsFilter = {},
): Promise<RegionVisitStat[]> {
  const db = await getDb();
  const { sql, params } = buildRegionVisitStatsQuery(filter);
  const rows = await db.getAllAsync<RegionStatRow>(sql, ...params);
  return rows.map((row) => ({
    region: row.region,
    placeCount: row.place_count,
    visitCount: row.visit_count,
    noteCount: row.note_count,
  }));
}

export async function listPlaceVisitStats(
  filter: StatsFilter = {},
): Promise<PlaceVisitStat[]> {
  const db = await getDb();
  const { sql, params } = buildPlaceVisitStatsQuery(filter);
  const rows = await db.getAllAsync<PlaceStatRow>(sql, ...params);
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    city: row.city,
    region: row.region,
    visitCount: row.visit_count,
    noteCount: row.note_count,
  }));
}

export async function getVisitTotals(
  filter: StatsFilter = {},
): Promise<VisitTotals> {
  const db = await getDb();
  const { sql, params } = buildVisitTotalsQuery(filter);
  const row = await db.getFirstAsync<TotalsRow>(sql, ...params);
  return {
    totalCities: row?.total_cities ?? 0,
    totalRegions: row?.total_regions ?? 0,
    totalPlaces: row?.total_places ?? 0,
    totalVisits: row?.total_visits ?? 0,
    totalNotes: row?.total_notes ?? 0,
  };
}
