const AUTH_EMAIL_DOMAIN = "catmeetup.app";

export function normalizePhone(phone: string) {
  return phone.replace(/[^0-9]/g, "");
}

export function buildAuthEmailFromPhone(phone: string) {
  const normalizedPhone = normalizePhone(phone);

  if (!normalizedPhone) {
    throw new Error("핸드폰번호를 입력해주세요.");
  }

  return `${normalizedPhone}@${AUTH_EMAIL_DOMAIN}`;
}

export function toFriendlyAuthError(message: string) {
  if (
    message.includes("Invalid login") ||
    message.includes("Invalid login credentials")
  ) {
    return "핸드폰번호 또는 비밀번호가 올바르지 않습니다.";
  }

  if (message.includes("User already registered")) {
    return "이미 가입된 핸드폰번호입니다.";
  }

  if (message.includes("Password should be at least")) {
    return "비밀번호는 영문과 숫자를 포함해 8자 이상이어야 합니다.";
  }

  if (message.includes("email address") && message.includes("invalid")) {
    return "로그인 ID 생성에 실패했습니다. 핸드폰번호를 다시 확인해주세요.";
  }

  if (message.includes("duplicate key") && message.includes("phone")) {
    return "이미 가입된 핸드폰번호입니다.";
  }

  if (message.includes("duplicate key") && message.includes("email")) {
    return "이미 사용 중인 이메일입니다.";
  }

  if (
    message.includes("duplicate key") &&
    (message.includes("kakao") || message.includes("kakao_id"))
  ) {
    return "이미 사용 중인 카카오톡 아이디입니다.";
  }

  return message;
}
