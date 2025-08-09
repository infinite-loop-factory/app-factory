import type { LocationObject } from "expo-location";

import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import * as Sentry from "@sentry/react-native";
import * as TaskManager from "expo-task-manager";
import { DateTime } from "luxon";
import { LOCATION_TASK_NAME } from "@/constants/location";
import {
  LAST_LOCATION_STORAGE_KEY,
  LOCATION_QUEUE_STORAGE_KEY,
} from "@/constants/storage-keys";
import supabase from "@/libs/supabase";
import { getCountryByLatLng } from "@/utils/reverse-geo";

export type LocationTaskData = { locations: LocationObject[] };

export type QueuedLocation = {
  user_id: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
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

async function saveLast(lat: number, lon: number): Promise<void> {
  try {
    await AsyncStorage.setItem(
      LAST_LOCATION_STORAGE_KEY,
      JSON.stringify({ ts: new Date().toISOString(), lat, lon }),
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
    timestamp: new Date(timestamp),
    country,
    country_code: countryCode,
  };
}

function dedupeRows(
  rows: QueuedLocation[],
  last: Last | null,
): QueuedLocation[] {
  if (!last) return rows;
  return rows.filter((row) => {
    const diff = DateTime.now().diff(DateTime.fromISO(last.ts), "hours").hours;
    return diff >= 1 || last.lat !== row.latitude || last.lon !== row.longitude;
  });
}

async function appendQueue(items: QueuedLocation[]): Promise<void> {
  const raw = await AsyncStorage.getItem(LOCATION_QUEUE_STORAGE_KEY);
  const queue: QueuedLocation[] = raw ? JSON.parse(raw) : [];
  queue.push(...items);
  await AsyncStorage.setItem(LOCATION_QUEUE_STORAGE_KEY, JSON.stringify(queue));
}

async function flushQueueWith(
  supabaseRows: QueuedLocation[],
): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const raw = await AsyncStorage.getItem(LOCATION_QUEUE_STORAGE_KEY);
  const queued: QueuedLocation[] = raw ? JSON.parse(raw) : [];
  const payload = queued.concat(supabaseRows);
  if (payload.length === 0) return { ok: true } as const;
  const { error: insertErr } = await supabase.from("locations").insert(payload);
  if (!insertErr) {
    await AsyncStorage.removeItem(LOCATION_QUEUE_STORAGE_KEY);
    const latest = payload[payload.length - 1];
    if (latest) await saveLast(latest.latitude, latest.longitude);
    return { ok: true } as const;
  }
  return { ok: false, error: insertErr } as const;
}

export async function flushLocationQueueIfAny(): Promise<void> {
  const { isConnected } = await NetInfo.fetch();
  if (!isConnected) return;
  await flushQueueWith([]);
}

TaskManager.defineTask<LocationTaskData>(
  LOCATION_TASK_NAME,
  async ({ data, error }) => {
    if (error) {
      console.error("Location task error:", error);
      Sentry.captureException(error);
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

      const { isConnected } = await NetInfo.fetch();
      if (!isConnected) {
        await appendQueue(filtered);
        return;
      }

      const res = await flushQueueWith(filtered);
      if (!res.ok) {
        console.error("Failed to insert locations:", res.error);
        Sentry.captureMessage("Failed to insert locations (background)");
      }
    } catch (err) {
      console.error("Unexpected error during location insert:", err);
      Sentry.captureException(err);
    }
  },
);
