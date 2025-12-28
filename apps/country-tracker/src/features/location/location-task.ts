import type { LocationObject } from "expo-location";

import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as Sentry from "@sentry/react-native";
import * as Network from "expo-network";
import * as TaskManager from "expo-task-manager";
import { DateTime } from "luxon";
import { LOCATION_TASK_NAME } from "@/constants/location";
import {
  LAST_LOCATION_STORAGE_KEY,
  LOCATION_QUEUE_STORAGE_KEY,
} from "@/constants/storage-keys";
import { LOCATION_MIN_RECORDING_INTERVAL_HOURS } from "@/features/location/constants";
import supabase from "@/libs/supabase";
import { normalizeTimestamp } from "@/utils/normalize-timestamp";
import { getCountryByLatLng } from "@/utils/reverse-geo";

export type LocationTaskData = { locations: LocationObject[] };

export type QueuedLocation = {
  user_id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  country: string;
  country_code: string;
};

export type Last = { ts: string; lat: number; lon: number };

async function loadLast(): Promise<Last | null> {
  try {
    const raw = await AsyncStorage.getItem(LAST_LOCATION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Last) : null;
  } catch {
    return null;
  }
}

async function saveLast(
  lat: number,
  lon: number,
  timestamp: string,
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      LAST_LOCATION_STORAGE_KEY,
      JSON.stringify({ ts: timestamp, lat, lon }),
    );
  } catch {
    // ignore
  }
}

async function toRow(
  userId: string,
  loc: LocationObject,
): Promise<QueuedLocation> {
  const {
    coords: { latitude, longitude },
    timestamp,
  } = loc;
  const { country, countryCode } = await getCountryByLatLng(
    latitude,
    longitude,
  );
  return {
    user_id: userId,
    latitude,
    longitude,
    timestamp: normalizeTimestamp(timestamp),
    country,
    country_code: countryCode,
  };
}

function dedupeRows(
  rows: QueuedLocation[],
  last: Last | null,
): QueuedLocation[] {
  let previousTs: DateTime | null = last
    ? DateTime.fromISO(last.ts, { zone: "utc" })
    : null;
  let previousLat = last?.lat ?? null;
  let previousLon = last?.lon ?? null;

  return rows
    .slice()
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
    .filter((row) => {
      const parsed = DateTime.fromISO(row.timestamp, { zone: "utc" });
      const rowTs = parsed.isValid
        ? parsed
        : DateTime.fromMillis(Date.now(), { zone: "utc" });
      const diffHours = previousTs
        ? rowTs.diff(previousTs, "hours").hours
        : Number.POSITIVE_INFINITY;
      const changedPosition =
        previousLat === null ||
        previousLon === null ||
        previousLat !== row.latitude ||
        previousLon !== row.longitude;
      const shouldKeep =
        diffHours >= LOCATION_MIN_RECORDING_INTERVAL_HOURS || changedPosition;
      if (shouldKeep) {
        previousTs = rowTs;
        previousLat = row.latitude;
        previousLon = row.longitude;
      }
      return shouldKeep;
    });
}

async function appendQueue(items: QueuedLocation[]): Promise<void> {
  const raw = await AsyncStorage.getItem(LOCATION_QUEUE_STORAGE_KEY);
  const queue: QueuedLocation[] = raw ? JSON.parse(raw) : [];
  const normalizedItems = items.map((item) => ({
    ...item,
    timestamp: normalizeTimestamp(item.timestamp),
  }));
  queue.push(...normalizedItems);
  await AsyncStorage.setItem(LOCATION_QUEUE_STORAGE_KEY, JSON.stringify(queue));
}

async function flushQueueWith(
  supabaseRows: QueuedLocation[],
): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const raw = await AsyncStorage.getItem(LOCATION_QUEUE_STORAGE_KEY);
  const queued: QueuedLocation[] = raw ? JSON.parse(raw) : [];
  const payload = queued.concat(supabaseRows).map((row) => ({
    ...row,
    timestamp: normalizeTimestamp(row.timestamp),
  }));
  if (payload.length === 0) {
    return { ok: true } as const;
  }

  const { error: insertErr } = await supabase.from("locations").insert(payload);
  if (!insertErr) {
    await AsyncStorage.removeItem(LOCATION_QUEUE_STORAGE_KEY);
    const latest = payload[payload.length - 1];
    if (latest) {
      await saveLast(latest.latitude, latest.longitude, latest.timestamp);
    }
    return { ok: true } as const;
  }
  return { ok: false, error: insertErr } as const;
}

export async function flushLocationQueueIfAny(): Promise<void> {
  try {
    const state = await Network.getNetworkStateAsync();
    const ok =
      Boolean(state?.isConnected) && state?.isInternetReachable !== false;
    if (!ok) return;
  } catch {
    // If network module is unavailable, assume online to avoid blocking flows
  }
  await flushQueueWith([]);
}

TaskManager.defineTask<LocationTaskData>(
  LOCATION_TASK_NAME,
  async ({ data, error }) => {
    if (error) {
      console.error("Location task error:", error);
      console.error(error);
      return;
    }

    const locations: LocationObject[] = data?.locations ?? [];
    if (locations.length === 0) return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      const rows = await Promise.all(
        locations.map((l: LocationObject) => toRow(user.id, l)),
      );
      const last = await loadLast();
      const filtered = dedupeRows(rows, last);
      if (filtered.length === 0) return;

      let ok = true;
      try {
        const state = await Network.getNetworkStateAsync();
        ok =
          Boolean(state?.isConnected) && state?.isInternetReachable !== false;
      } catch {
        ok = true;
      }
      if (!ok) {
        await appendQueue(filtered);
        return;
      }

      const res = await flushQueueWith(filtered);
      if (!res.ok) {
        console.error("Failed to insert locations:", res.error);
        console.error("Failed to insert locations (background)");
      }
    } catch (err) {
      console.error("Unexpected error during location insert:", err);
      console.error(err);
    }
  },
);
