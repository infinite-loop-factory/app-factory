import type { User } from "@supabase/supabase-js";

import { LOCATION_TASK_NAME } from "@/constants/location";
import supabase from "@/libs/supabase";
import { getCountryByLatLng } from "@/utils/reverse-geo";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { DateTime } from "luxon";
import { Platform } from "react-native";

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

  const storageKey = "country-tracker-last-location";
  let last: { ts: string; lat: number; lon: number } | null = null;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) last = JSON.parse(raw);
  } catch {
    /* ignore */
  }

  let shouldInsert = false;
  if (!last) {
    shouldInsert = true;
  } else {
    const diff = DateTime.now().diff(DateTime.fromISO(last.ts), "hours").hours;
    // 1시간이 지났거나, 좌표가 다르면 insert
    if (diff >= 1 || last.lat !== latitude || last.lon !== longitude) {
      shouldInsert = true;
    }
  }
  if (!shouldInsert) {
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
      JSON.stringify({ ts: timestamp, lat: latitude, lon: longitude }),
    );
  } else {
    console.error("Failed to insert location (web):", error);
  }
}

export async function startLocationTask() {
  // 포그라운드 권한 요청
  const fg = await Location.requestForegroundPermissionsAsync();
  if (fg.status !== "granted") {
    return;
  }

  // 백그라운드 권한 요청
  const bg = await Location.requestBackgroundPermissionsAsync();
  if (bg.status !== "granted") {
    return;
  }

  if (Platform.OS === "web" && typeof window !== "undefined") {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      return;
    }

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
    return;
  }

  if (!(await TaskManager.isAvailableAsync())) {
    return;
  }

  const isTaskDefined =
    await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
  if (!isTaskDefined) {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 60 * 60 * 1000,
    });
  }
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
