import { supabase } from "@/utils/supabase";

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export const fetchUsername = async (userId: string) => {
  const { data: profileData } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .single();

  return profileData?.username ?? null;
};
