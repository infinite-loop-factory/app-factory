import type { SQLiteDatabase } from "expo-sqlite";

import { migration001Init } from "./001-init";

export type Migration = {
  version: number;
  sql: string;
};

const migrations: Migration[] = [migration001Init];

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS _meta (
      key TEXT PRIMARY KEY NOT NULL,
      value INTEGER NOT NULL
    );
    INSERT OR IGNORE INTO _meta(key, value) VALUES ('version', 0);
  `);

  const row = await db.getFirstAsync<{ value: number }>(
    "SELECT value FROM _meta WHERE key = 'version'",
  );
  const currentVersion = row?.value ?? 0;

  const pending = migrations
    .filter((m) => m.version > currentVersion)
    .sort((a, b) => a.version - b.version);

  for (const migration of pending) {
    await db.withTransactionAsync(async () => {
      await db.execAsync(migration.sql);
      await db.runAsync(
        "UPDATE _meta SET value = ? WHERE key = 'version'",
        migration.version,
      );
    });
  }
}
