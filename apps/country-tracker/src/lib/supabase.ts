import "react-native-url-polyfill/auto";
import type { SupportedStorage } from "@supabase/supabase-js";

import { createClient } from "@supabase/supabase-js";
import { AppState, Platform } from "react-native";
import { env } from "@/constants/env";

let storage: SupportedStorage | undefined;
const isWeb = Platform.OS === "web";
if (isWeb) {
  storage = undefined;
} else {
  storage = require("@react-native-async-storage/async-storage").default;
}

export const supabase = createClient(
  env.EXPO_PUBLIC_SUPABASE_URL,
  env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      debug: false,
    },
  },
);

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default supabase;
