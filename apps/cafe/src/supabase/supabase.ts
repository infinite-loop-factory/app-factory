import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import { Platform } from "react-native";

// Prefer Expo extra (native + dev/prod builds), but fall back to process.env on web
const extra = (Constants.expoConfig?.extra || {}) as Record<string, unknown>;
const supabaseUrl = String(
  (extra.SUPABASE_URL as string | undefined) ??
    process.env.EXPO_PUBLIC_SUPABASE_URL ??
    "",
);
const supabaseAnonKey = String(
  (extra.SUPABASE_ANON_KEY as string | undefined) ??
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
    "",
);

if (!(supabaseUrl && supabaseAnonKey)) {
  // Avoid passing empty strings to createClient (causes runtime error)
  throw new Error(
    "[Supabase] Missing env. Configure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env and ensure apps/cafe/app.config.ts injects them into extra. Restart Expo (expo start -c).",
  );
}

// SSR-safe in-memory storage (used when window is unavailable on web SSR)
const memoryStorage = (() => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  } as Storage;
})();

// Resolve a storage implementation per platform/runtime without breaking SSR
// Define a union type that matches web Storage (sync) and React Native AsyncStorage (async)
type AsyncStorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

type StorageLike = Storage | AsyncStorageLike;

let storage: StorageLike;
if (Platform.OS === "web") {
  // Browser web vs. SSR
  if (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  ) {
    storage = window.localStorage;
  } else {
    storage = memoryStorage;
  }
} else {
  // Native platforms: require AsyncStorage lazily so it isn't loaded on web/SSR
  const AsyncStorage = require("@react-native-async-storage/async-storage")
    .default as AsyncStorageLike;
  storage = AsyncStorage;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    // On web, allow Supabase to parse code from URL. We still keep /auth route for explicit flows.
    detectSessionInUrl: Platform.OS === "web",
  },
});
