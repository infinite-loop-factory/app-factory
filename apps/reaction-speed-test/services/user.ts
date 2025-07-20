import { supabase } from "@/utils/supabase";

export interface SignUpData {
  email: string;
  password: string;
  username: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const signUpUser = async (data: SignUpData) => {
  const { email, password, username } = data;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return { error: authError };
  }

  if (authData.user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([{ id: authData.user.id, username, email }]);

    if (profileError) {
      return { error: profileError };
    }
  }

  return { data: authData };
};

export const signInUser = async (data: SignInData) => {
  const { email, password } = data;

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data: authData, error };
};

export const fetchUsername = async (userId: string): Promise<string> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .single();

  if (error) {
    throw error;
  }

  return data?.username || "사용자";
};
