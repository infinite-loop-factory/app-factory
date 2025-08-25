import { fetch } from "expo/fetch";
import * as Location from "expo-location";
import { Platform } from "react-native";

export type ReverseGeoResult = {
  country: string;
  countryCode: string;
};

const geoCache: Record<string, ReverseGeoResult> = {};
const pendingPromises: Record<string, Promise<ReverseGeoResult>> = {};

export async function getCountryByLatLng(
  lat: number,
  lng: number,
): Promise<ReverseGeoResult> {
  const round = (v: number) => Math.round(v * 100) / 100;
  const key = `${round(lat)},${round(lng)}`;
  const existing = pendingPromises[key];
  if (existing) {
    return existing;
  }

  if (Platform.OS === "web") {
    pendingPromises[key] = (async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${round(lat)}&lon=${round(lng)}`,
        );
        const data = await res.json();
        const result = {
          country: data.address?.country || "Unknown",
          countryCode: data.address?.country_code?.toUpperCase() || "",
        };
        geoCache[key] = result;
        delete pendingPromises[key];
        return result;
      } catch {
        delete pendingPromises[key];
        return { country: "Unknown", countryCode: "" };
      }
    })();
    const created = pendingPromises[key];
    if (created) return created;
    // Fallback (should not happen)
    return { country: "Unknown", countryCode: "" };
  }

  try {
    const results = await Location.reverseGeocodeAsync({
      latitude: round(lat),
      longitude: round(lng),
    });
    const result = {
      country: results[0]?.country || "Unknown",
      countryCode: results[0]?.isoCountryCode || "",
    };
    geoCache[key] = result;
    return result;
  } catch {
    return { country: "Unknown", countryCode: "" };
  }
}
