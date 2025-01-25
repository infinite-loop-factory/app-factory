import { supabase } from "@/utils/supabase";

interface SignUpParams {
  email: string;
  password: string;
  username: string;
}

interface SignInParams {
  email: string;
  password: string;
}

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export const signUpUser = async ({
  email,
  password,
  username,
}: SignUpParams) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  });
  return { error };
};

export const signInUser = async ({ email, password }: SignInParams) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { error };
};

export const fetchUsername = async (userId: string) => {
  const { data: profileData } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .single();

  return profileData?.username ?? null;
};
