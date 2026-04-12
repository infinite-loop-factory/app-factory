import type { Station } from "@/types/station";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface RouteSearchState {
  startStation: Station | null;
  viaStation: Station | null;
  endStation: Station | null;
}

interface RouteSearchContextValue extends RouteSearchState {
  setStartStation: (station: Station | null) => void;
  setViaStation: (station: Station | null) => void;
  setEndStation: (station: Station | null) => void;
  clearAll: () => void;
  canSearch: boolean;
}

const initialState: RouteSearchState = {
  startStation: null,
  viaStation: null,
  endStation: null,
};

const RouteSearchContext = createContext<RouteSearchContextValue | null>(null);

export function RouteSearchProvider({ children }: { children: ReactNode }) {
  const [startStation, setStartStation] = useState<Station | null>(
    initialState.startStation,
  );
  const [viaStation, setViaStation] = useState<Station | null>(
    initialState.viaStation,
  );
  const [endStation, setEndStation] = useState<Station | null>(
    initialState.endStation,
  );

  const clearAll = useCallback(() => {
    setStartStation(null);
    setViaStation(null);
    setEndStation(null);
  }, []);

  const canSearch = startStation !== null && endStation !== null;

  const value = useMemo<RouteSearchContextValue>(
    () => ({
      startStation,
      viaStation,
      endStation,
      setStartStation,
      setViaStation,
      setEndStation,
      clearAll,
      canSearch,
    }),
    [startStation, viaStation, endStation, clearAll, canSearch],
  );

  return (
    <RouteSearchContext.Provider value={value}>
      {children}
    </RouteSearchContext.Provider>
  );
}

export function useRouteSearch() {
  const ctx = useContext(RouteSearchContext);
  if (!ctx) {
    throw new Error("useRouteSearch must be used within RouteSearchProvider");
  }
  return ctx;
}
