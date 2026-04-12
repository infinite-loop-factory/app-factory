import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";
import { queryKeys } from "../queryKeys";

const deleteDog = async (dogId: number) => {
  const { error } = await supabase
    .from("dogs")
    .update({ deleted_at: new Date() })
    .eq("id", dogId);

  if (error) throw error;
};

export const useDeleteDog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dogId: number) => deleteDog(dogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.dogs.findDogs] });
    },
  });
};
