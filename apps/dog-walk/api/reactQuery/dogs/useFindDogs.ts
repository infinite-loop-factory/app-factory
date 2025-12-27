import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";
import { queryKeys } from "../queryKeys";

const fetchDogs = async (userId: string) => {
  if (!userId) return;

  const { data, error } = await supabase
    .from("dogs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};

export const useFindDogs = (userId: string) => {
  return useQuery({
    queryKey: [queryKeys.dogs.findDogs, userId],
    queryFn: () => fetchDogs(userId),
    enabled: !!userId,
  });
};
