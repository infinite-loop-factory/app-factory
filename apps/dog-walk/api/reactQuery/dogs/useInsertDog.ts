import { supabase } from "@/api/supabaseClient";
import { useMutation } from "@tanstack/react-query";

interface InsertDogPayload {
  userId: string;
  name: string;
  breed: string;
  gender: string;
  birthdate: Date;
  imageUrl: string;
}

const insertDog = async ({
  userId,
  name,
  breed,
  gender,
  birthdate,
  imageUrl,
}: InsertDogPayload) => {
  const { error } = await supabase.from("dogs").insert({
    created_at: new Date(),
    user_id: userId,
    name,
    breed,
    gender,
    birthdate,
    image_url: imageUrl,
  });

  if (error) throw error;
};

export const useInsertDog = () => {
  return useMutation({
    mutationFn: (payload: InsertDogPayload) => insertDog(payload),
  });
};
