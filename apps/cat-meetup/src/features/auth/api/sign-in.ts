import { supabase } from "@/lib/supabase";
import { buildAuthEmailFromPhone, toFriendlyAuthError } from "./shared";

export type SignInInput = {
  phone: string;
  password: string;
};

export async function signInWithPhonePassword(input: SignInInput) {
  const email = buildAuthEmailFromPhone(input.phone);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: input.password,
  });

  if (error) {
    throw new Error(toFriendlyAuthError(error.message));
  }

  return data;
}
