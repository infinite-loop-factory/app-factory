import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/api/supabaseClient";

interface InsertUserPayload {
  id: string;
  email: string;
  name: string;
  profileImageUrl: string;
}

const insertUser = async ({
  id,
  email,
  name,
  profileImageUrl,
}: InsertUserPayload) => {
  const { error } = await supabase.from("users").insert({
    id,
    created_at: new Date(),
    email,
    name,
    profile_image_url: profileImageUrl,
  });

  if (error) throw error;
};

export const useInsertUser = () => {
  return useMutation({
    mutationFn: (payload: InsertUserPayload) => insertUser(payload),
  });
};
