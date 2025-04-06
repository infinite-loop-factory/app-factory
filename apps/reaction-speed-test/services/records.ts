import { getCurrentUser } from "@/services";
import { supabase } from "@/utils/supabase";

export const insertRecord = async (result_value: number) => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("records")
    .insert([
      {
        user_id: user.id,
        result_value,
        unit: "ms",
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getRecords = async () => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("로그인이 필요합니다");
  }

  const { data, error } = await supabase
    .from("records")
    .select("id, created_at, result_value, unit")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
};
