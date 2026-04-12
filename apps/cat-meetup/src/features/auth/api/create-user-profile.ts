import type { SignupFormValues } from "../types";

import { supabase } from "@/lib/supabase";
import { normalizePhone, toFriendlyAuthError } from "./shared";

type CreateUserProfileInput = Pick<
  SignupFormValues,
  | "name"
  | "phone"
  | "kakaoId"
  | "email"
  | "gender"
  | "birthDate"
  | "regionCode"
  | "bio"
> & {
  authUserId: string;
};

async function ensureUniqueValue(params: {
  column: "phone" | "email" | "kakao_id";
  message: string;
  value: string;
}) {
  if (!params.value) return;

  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq(params.column, params.value)
    .is("deleted_at", null)
    .limit(1);

  if (error) {
    throw new Error(toFriendlyAuthError(error.message));
  }

  if (data && data.length > 0) {
    throw new Error(params.message);
  }
}

export async function assertUserProfileAvailable(
  input: Pick<SignupFormValues, "phone" | "email" | "kakaoId">,
) {
  const normalizedPhone = normalizePhone(input.phone);

  await ensureUniqueValue({
    column: "phone",
    value: normalizedPhone,
    message: "이미 가입된 핸드폰번호입니다.",
  });

  await ensureUniqueValue({
    column: "email",
    value: input.email.trim(),
    message: "이미 사용 중인 이메일입니다.",
  });

  await ensureUniqueValue({
    column: "kakao_id",
    value: input.kakaoId.trim(),
    message: "이미 사용 중인 카카오톡 아이디입니다.",
  });
}

export async function createUserProfile(input: CreateUserProfileInput) {
  const { data, error } = await supabase
    .from("users")
    .insert({
      auth_user_id: input.authUserId,
      name: input.name.trim(),
      phone: normalizePhone(input.phone),
      kakao_id: input.kakaoId.trim(),
      email: input.email.trim(),
      gender: input.gender,
      birth_date: input.birthDate,
      region_code: input.regionCode,
      bio: input.bio.trim(),
    })
    .select("id, auth_user_id, name, phone, email, region_code")
    .single();

  if (error) {
    throw new Error(toFriendlyAuthError(error.message));
  }

  return data;
}
