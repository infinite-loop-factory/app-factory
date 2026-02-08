"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { SyncState, SyncStatus, SyncedItems } from "@/types/sync-status";
import { initialSyncState } from "@/types/sync-status";

interface SyncStatusContextValue extends SyncState {
  setSyncStatus: (status: SyncStatus) => void
  setLastSync: (timestamp: number, items: SyncedItems, error?: string | null) => void
  resetSyncState: () => void
}

const SyncStatusContext = createContext<SyncStatusContextValue | null>(null);

export function SyncStatusProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SyncState>(initialSyncState);

  const setSyncStatus = useCallback((status: SyncStatus) => {
    setState((prev) => ({ ...prev, status }));
  }, []);

  const setLastSync = useCallback(
    (timestamp: number, items: SyncedItems, error?: string | null) => {
      setState((prev) => ({
        ...prev,
        status: error ? "error" : "success",
        lastSyncTimestamp: timestamp,
        lastSyncError: error ?? null,
        items,
      }));
    },
    [],
  );

  const resetSyncState = useCallback(() => {
    setState(initialSyncState);
  }, []);

  const value = useMemo<SyncStatusContextValue>(
    () => ({
      ...state,
      setSyncStatus,
      setLastSync,
      resetSyncState,
    }),
    [state, setSyncStatus, setLastSync, resetSyncState],
  );

  return (
    <SyncStatusContext.Provider value={value}>
      {children}
    </SyncStatusContext.Provider>
  );
}

export function useSyncStatus() {
  const ctx = useContext(SyncStatusContext);
  if (!ctx) {
    throw new Error("useSyncStatus must be used within SyncStatusProvider");
  }
  return ctx;
}
