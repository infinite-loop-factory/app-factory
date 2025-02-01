import "react-native-url-polyfill/auto";
import type { Database } from "@/supabase/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!(supabaseUrl && supabaseAnonKey)) {
  throw new Error("Supabase 환경 변수가 설정되지 않았습니다.");
}

const authOptions = {
  storage: AsyncStorage,
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: authOptions,
});
