import { supabase } from "@/utils/supabase";

export const insertRecord = async (result_value: number) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
