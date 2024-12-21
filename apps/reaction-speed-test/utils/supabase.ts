import "react-native-url-polyfill/auto";
import { env } from "@/constants/env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseUrl = env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

const isWeb = Platform.OS === "web";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: !isWeb,
    detectSessionInUrl: false,
  },
});
