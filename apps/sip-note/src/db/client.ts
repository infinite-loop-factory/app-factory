import type { SQLiteDatabase } from "expo-sqlite";

import * as SQLite from "expo-sqlite";
import { runMigrations } from "./migrations";

const DB_NAME = "sip-note.db";

let dbPromise: Promise<SQLiteDatabase> | null = null;

export function getDb(): Promise<SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DB_NAME);
      await db.execAsync("PRAGMA foreign_keys = ON;");
      await runMigrations(db);
      return db;
    })();
  }
  return dbPromise;
}

export async function closeDb(): Promise<void> {
  if (!dbPromise) return;
  const db = await dbPromise;
  await db.closeAsync();
  dbPromise = null;
}
