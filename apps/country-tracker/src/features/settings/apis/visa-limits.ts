import supabase from "@/lib/supabase";

export interface VisaLimit {
  id: string;
  user_id: string;
  country_code: string;
  max_days: number;
  alert_days_before: number;
  created_at: string;
  updated_at: string;
}

export async function fetchVisaLimits(userId: string): Promise<VisaLimit[]> {
  const { data, error } = await supabase
    .from("visa_limits")
    .select("*")
    .eq("user_id", userId)
    .order("country_code");
  if (error) throw error;
  return data ?? [];
}

export async function upsertVisaLimit(params: {
  userId: string;
  countryCode: string;
  maxDays: number;
  alertDaysBefore: number;
}): Promise<void> {
  const { error } = await supabase.from("visa_limits").upsert(
    {
      user_id: params.userId,
      country_code: params.countryCode.toLowerCase(),
      max_days: params.maxDays,
      alert_days_before: params.alertDaysBefore,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,country_code" },
  );
  if (error) throw error;
}

export async function deleteVisaLimit(id: string): Promise<void> {
  const { error } = await supabase.from("visa_limits").delete().eq("id", id);
  if (error) throw error;
}
