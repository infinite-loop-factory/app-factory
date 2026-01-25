import type { User } from "@supabase/supabase-js";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { DateTime } from "luxon";
import { Platform } from "react-native";
import { LOCATION_TASK_NAME } from "@/constants/location";
import { LAST_LOCATION_STORAGE_KEY } from "@/constants/storage-keys";
import {
  LOCATION_DEFERRED_DISTANCE_METERS,
  LOCATION_DEFERRED_UPDATES_INTERVAL_MS,
  LOCATION_DISTANCE_INTERVAL_METERS,
  LOCATION_MIN_RECORDING_INTERVAL_HOURS,
  LOCATION_PAUSES_UPDATES_AUTOMATICALLY,
  LOCATION_SHOWS_BACKGROUND_INDICATOR,
  LOCATION_TIME_INTERVAL_MS,
} from "@/features/location/constants";
import i18n from "@/lib/i18n";
import supabase from "@/lib/supabase";
import { normalizeTimestamp } from "@/utils/normalize-timestamp";
import { getCountryByLatLng } from "@/utils/reverse-geo";

type LastLocation = { ts: string | number; lat: number; lon: number };

export type StartLocationTaskOptions = {
  onPermissionDenied?: () => void;
};

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
    DateTime.fromISO(normalizeTimestamp(last.ts)),
    "hours",
  ).hours;
  // Insert if the last entry is older than the configured interval or the coordinates changed.
  return (
    diff >= LOCATION_MIN_RECORDING_INTERVAL_HOURS ||
    last.lat !== latitude ||
    last.lon !== longitude
  );
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

function startWebLocationTracking(
  user: User,
  options?: StartLocationTaskOptions,
) {
  if (typeof navigator === "undefined") return;

  navigator.geolocation.getCurrentPosition(
    (pos) => handleWebLocationInsert(user, pos),
    (err) => {
      if (err.code === 1) {
        console.error("Location permission denied by the user.");
        options?.onPermissionDenied?.();
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
  const foregroundService = {
    notificationTitle: i18n.t("location.foregroundService.title"),
    notificationBody: i18n.t("location.foregroundService.body"),
  } as const;

  let hasStarted = false;
  try {
    hasStarted =
      await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  } catch {
    hasStarted = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
  }
  if (!hasStarted) {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
      // reduce battery & duplicates: at least 300m or 1 hour
      distanceInterval: LOCATION_DISTANCE_INTERVAL_METERS,
      timeInterval: LOCATION_TIME_INTERVAL_MS,
      pausesUpdatesAutomatically: LOCATION_PAUSES_UPDATES_AUTOMATICALLY,
      // foreground service config for Android
      foregroundService,
      // defer updates when device is in low power/idle where available
      deferredUpdatesInterval: LOCATION_DEFERRED_UPDATES_INTERVAL_MS,
      deferredUpdatesDistance: LOCATION_DEFERRED_DISTANCE_METERS,
      showsBackgroundLocationIndicator: LOCATION_SHOWS_BACKGROUND_INDICATOR,
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

    const resolvedTimestamp = normalizeTimestamp(timestamp);
    const { error } = await supabase.from("locations").insert([
      {
        user_id: user.id,
        latitude,
        longitude,
        timestamp: resolvedTimestamp,
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
      ts: resolvedTimestamp,
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

  const resolvedTimestamp = normalizeTimestamp(timestamp);
  const { error } = await supabase.from("locations").insert([
    {
      user_id: user.id,
      latitude,
      longitude,
      timestamp: resolvedTimestamp,
      country,
      country_code: countryCode,
    },
  ]);

  if (!error) {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        ts: resolvedTimestamp,
        lat: latitude,
        lon: longitude,
      }),
    );
  } else {
    console.error("Failed to insert location (web):", error);
  }
}

export async function startLocationTask(options?: StartLocationTaskOptions) {
  const permissionsGranted = await requestLocationPermissions();
  if (!permissionsGranted) {
    options?.onPermissionDenied?.();
    return;
  }

  const user = await getAuthedUser();
  if (!user) {
    return;
  }

  if (Platform.OS === "web" && typeof window !== "undefined") {
    startWebLocationTracking(user, options);
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
