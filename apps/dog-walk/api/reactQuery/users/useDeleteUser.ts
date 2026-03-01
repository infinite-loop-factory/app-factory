import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";

const deleteUser = async (userId: string) => {
  const { error } = await supabase.from("users").delete().eq("id", userId);

  if (error) throw error;
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
  });
};
