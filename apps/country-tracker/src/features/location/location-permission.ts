import type { User } from "@supabase/supabase-js";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { DateTime } from "luxon";
import { Platform } from "react-native";
import { LOCATION_TASK_NAME } from "@/constants/location";
import { LAST_LOCATION_STORAGE_KEY } from "@/constants/storage-keys";
import supabase from "@/libs/supabase";
import { getCountryByLatLng } from "@/utils/reverse-geo";

type LastLocation = { ts: string | number; lat: number; lon: number };

function toIsoString(value: string | number): string {
  if (typeof value === "string") {
    return value;
  }
  return new Date(value).toISOString();
}

async function getAuthedUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}

function shouldRecordLocation(
  last: LastLocation | null,
  latitude: number,
  longitude: number,
): boolean {
  if (!last) return true;
  const diff = DateTime.now().diff(
    DateTime.fromISO(toIsoString(last.ts)),
    "hours",
  ).hours;
  // Insert if the last entry is older than an hour or the coordinates changed.
  return diff >= 1 || last.lat !== latitude || last.lon !== longitude;
}

async function readLastLocation(): Promise<LastLocation | null> {
  try {
    const raw = await AsyncStorage.getItem(LAST_LOCATION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LastLocation) : null;
  } catch {
    return null;
  }
}

async function writeLastLocation(record: LastLocation) {
  try {
    await AsyncStorage.setItem(
      LAST_LOCATION_STORAGE_KEY,
      JSON.stringify(record),
    );
  } catch {
    // ignore write failures – they'll be retried next time
  }
}

function startWebLocationTracking(user: User) {
  if (typeof navigator === "undefined") return;

  navigator.geolocation.getCurrentPosition(
    (pos) => handleWebLocationInsert(user, pos),
    (err) => {
      if (err.code === 1) {
        console.error("위치 권한이 거부되었습니다.");
      } else if (err.code === 2) {
        console.error("위치 정보를 사용할 수 없습니다.");
      } else if (err.code === 3) {
        console.error("위치 요청이 타임아웃되었습니다.");
      } else {
        console.error("Geolocation error (web):", err);
      }
    },
    { enableHighAccuracy: false, maximumAge: 10000, timeout: 60000 },
  );
}

async function requestLocationPermissions(): Promise<boolean> {
  const foreground = await Location.requestForegroundPermissionsAsync();
  if (foreground.status !== "granted") {
    return false;
  }
  const background = await Location.requestBackgroundPermissionsAsync();
  return background.status === "granted";
}

async function ensureBackgroundUpdatesRegistered() {
  const isTaskDefined =
    await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
  if (!isTaskDefined) {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
      // reduce battery & duplicates: at least 300m or 1 hour
      distanceInterval: 300,
      timeInterval: 60 * 60 * 1000,
      pausesUpdatesAutomatically: true,
      // foreground service config for Android
      foregroundService: {
        notificationTitle: "Location Tracking",
        notificationBody: "Tracking your location to update visited countries.",
      },
      // defer updates when device is in low power/idle where available
      deferredUpdatesInterval: 10 * 60 * 1000,
      deferredUpdatesDistance: 500,
      showsBackgroundLocationIndicator: false,
    });
  }
}

async function recordForegroundLocation(user: User) {
  try {
    const current = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const {
      coords: { latitude, longitude },
      timestamp,
    } = current;
    const { country, countryCode } = await getCountryByLatLng(
      latitude,
      longitude,
    );

    const last = await readLastLocation();
    if (!shouldRecordLocation(last, latitude, longitude)) {
      return;
    }

    const { error } = await supabase.from("locations").insert([
      {
        user_id: user.id,
        latitude,
        longitude,
        timestamp: new Date(timestamp ?? Date.now()),
        country,
        country_code: countryCode,
      },
    ]);

    if (error) {
      if (error.code === "42501") {
        console.error(
          "Failed to insert location due to Supabase RLS policy. Ensure the table allows authenticated inserts where user_id = auth.uid().",
        );
      } else {
        console.error("Failed to insert location (foreground):", error);
      }
      return;
    }

    await writeLastLocation({
      ts: new Date().toISOString(),
      lat: latitude,
      lon: longitude,
    });
  } catch (err) {
    console.error("Failed to capture current location:", err);
  }
}

async function handleWebLocationInsert(user: User, pos: GeolocationPosition) {
  // 소수점 2자리 반올림
  const {
    coords: { latitude, longitude },
    timestamp,
  } = pos;

  // reverse geocoding
  const { country, countryCode } = await getCountryByLatLng(
    latitude,
    longitude,
  );

  const storageKey = LAST_LOCATION_STORAGE_KEY;
  let last: { ts: string; lat: number; lon: number } | null = null;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) last = JSON.parse(raw);
  } catch {
    /* ignore */
  }

  if (!shouldRecordLocation(last, latitude, longitude)) {
    return;
  }

  const { error } = await supabase.from("locations").insert([
    {
      user_id: user.id,
      latitude,
      longitude,
      timestamp: new Date(pos.timestamp),
      country,
      country_code: countryCode,
    },
  ]);

  if (!error) {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        ts:
          typeof timestamp === "number"
            ? new Date(timestamp).toISOString()
            : timestamp,
        lat: latitude,
        lon: longitude,
      }),
    );
  } else {
    console.error("Failed to insert location (web):", error);
  }
}

export async function startLocationTask() {
  const permissionsGranted = await requestLocationPermissions();
  if (!permissionsGranted) return;

  const user = await getAuthedUser();
  if (!user) return;

  if (Platform.OS === "web" && typeof window !== "undefined") {
    startWebLocationTracking(user);
    return;
  }

  if (!(await TaskManager.isAvailableAsync())) {
    return;
  }

  await recordForegroundLocation(user);
  await ensureBackgroundUpdatesRegistered();
}

export async function stopLocationTask() {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return;
  }
  if (!(await TaskManager.isAvailableAsync())) {
    return;
  }

  await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
}
