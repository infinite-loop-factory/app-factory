// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_SUPABASE_URL: string;
    EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
    EXPO_PUBLIC_SUPABASE_ACCESS_TOKEN: string;
    EXPO_PUBLIC_PROJECT_ID: string;
  }
}
