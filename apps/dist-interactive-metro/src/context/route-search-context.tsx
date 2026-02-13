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
  departure: Station | null;
  arrival: Station | null;
  viaStations: Station[];
}

interface RouteSearchContextValue extends RouteSearchState {
  setDeparture: (station: Station | null) => void;
  setArrival: (station: Station | null) => void;
  setViaStations: (stations: Station[]) => void;
  addViaStation: (station: Station) => void;
  removeViaStation: (stationId: string) => void;
  clearAll: () => void;
  canSearch: boolean;
  canAddVia: boolean;
  maxViaStations: number;
}

const initialState: RouteSearchState = {
  departure: null,
  arrival: null,
  viaStations: [],
};

const MAX_VIA_STATIONS = 3;

const RouteSearchContext = createContext<RouteSearchContextValue | null>(null);

export function RouteSearchProvider({ children }: { children: ReactNode }) {
  const [departure, setDeparture] = useState<Station | null>(
    initialState.departure,
  );
  const [arrival, setArrival] = useState<Station | null>(initialState.arrival);
  const [viaStations, setViaStations] = useState<Station[]>(
    initialState.viaStations,
  );

  const addViaStation = useCallback((station: Station) => {
    setViaStations((prev) => {
      if (prev.length >= MAX_VIA_STATIONS) return prev;
      if (prev.some((s) => s.id === station.id)) return prev;
      return [...prev, station];
    });
  }, []);

  const removeViaStation = useCallback((stationId: string) => {
    setViaStations((prev) => prev.filter((s) => s.id !== stationId));
  }, []);

  const clearAll = useCallback(() => {
    setDeparture(null);
    setArrival(null);
    setViaStations([]);
  }, []);

  const canSearch = departure !== null && arrival !== null;

  const canAddVia =
    (departure !== null || arrival !== null) &&
    viaStations.length < MAX_VIA_STATIONS;

  const value = useMemo<RouteSearchContextValue>(
    () => ({
      departure,
      arrival,
      viaStations,
      setDeparture,
      setArrival,
      setViaStations,
      addViaStation,
      removeViaStation,
      clearAll,
      canSearch,
      canAddVia,
      maxViaStations: MAX_VIA_STATIONS,
    }),
    [
      departure,
      arrival,
      viaStations,
      addViaStation,
      removeViaStation,
      clearAll,
      canSearch,
      canAddVia,
    ],
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
