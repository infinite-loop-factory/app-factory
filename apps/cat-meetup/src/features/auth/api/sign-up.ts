import type { SignupFormValues } from "../types";

import { supabase } from "@/lib/supabase";
import {
  assertUserProfileAvailable,
  createUserProfile,
} from "./create-user-profile";
import {
  buildAuthEmailFromPhone,
  normalizePhone,
  toFriendlyAuthError,
} from "./shared";

export async function signUpWithPhoneProfile(input: SignupFormValues) {
  const phone = normalizePhone(input.phone);
  const authEmail = buildAuthEmailFromPhone(phone);

  await assertUserProfileAvailable(input);

  const { data, error } = await supabase.auth.signUp({
    email: authEmail,
    password: input.password,
    options: {
      data: {
        name: input.name.trim(),
        phone,
      },
    },
  });

  if (error) {
    throw new Error(toFriendlyAuthError(error.message));
  }

  if (!data.user) {
    throw new Error("회원가입에 실패했습니다. 다시 시도해주세요.");
  }

  if (!data.session) {
    throw new Error(
      "Supabase 이메일 확인이 켜져 있습니다. 대시보드에서 Confirm email을 꺼주세요.",
    );
  }

  try {
    const userProfile = await createUserProfile({
      ...input,
      authUserId: data.user.id,
    });

    return {
      ...data,
      userProfile,
    };
  } catch (error) {
    await supabase.auth.signOut();
    throw error;
  }
}
