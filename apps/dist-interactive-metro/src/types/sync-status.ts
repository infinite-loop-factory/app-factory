/**
 * Sync status for public API → local DB.
 * Used by dev screen and future sync service.
 */
export type SyncStatus = "idle" | "syncing" | "success" | "error";

export interface SyncedItems {
  lines: number;
  stations: number;
  /** Number of distinct routes (분기선 포함) synced from KRIC subwayRouteInfo */
  routes: number;
  transfers: number;
}

export interface SyncState {
  status: SyncStatus;
  lastSyncTimestamp: number | null;
  lastSyncError: string | null;
  items: SyncedItems;
}

export const initialSyncState: SyncState = {
  status: "idle",
  lastSyncTimestamp: null,
  lastSyncError: null,
  items: {
    lines: 0,
    stations: 0,
    routes: 0,
    transfers: 0,
  },
};
