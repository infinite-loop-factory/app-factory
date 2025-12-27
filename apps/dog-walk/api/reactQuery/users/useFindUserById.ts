import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";
import { queryKeys } from "../queryKeys";

const fetchUserById = async (userId: string) => {
  if (!userId) throw new Error("User ID 없음");

  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
};

export const useFindUserById = (userId: string, enabled = false) => {
  return useQuery({
    queryKey: [queryKeys.users.findUserById, userId],
    queryFn: () => fetchUserById(userId),
    enabled: enabled && !!userId,
  });
};
