import "react-native-url-polyfill/auto";
import type { SupportedStorage } from "@supabase/supabase-js";

import { createClient } from "@supabase/supabase-js";
import { AppState, Platform } from "react-native";

let storage: SupportedStorage | undefined;
if (Platform.OS === "web") {
  storage = undefined;
} else {
  storage = require("@react-native-async-storage/async-storage").default;
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default supabase;
