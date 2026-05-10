import {
  emptySignupFieldErrors,
  type SignupFieldErrors,
  type SignupFormValues,
} from "../types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const birthDatePattern = /^\d{4}-\d{2}-\d{2}$/;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export function validateSignUpForm(values: SignupFormValues) {
  const errors: SignupFieldErrors = { ...emptySignupFieldErrors };
  let isValid = true;

  const phoneDigits = values.phone.replace(/[^0-9]/g, "");

  if (!values.name.trim()) {
    errors.name = "이름을 입력해주세요.";
    isValid = false;
  }

  if (!phoneDigits) {
    errors.phone = "핸드폰번호를 입력해주세요.";
    isValid = false;
  } else if (phoneDigits.length < 10 || phoneDigits.length > 11) {
    errors.phone = "올바른 핸드폰번호를 입력해주세요.";
    isValid = false;
  }

  if (!values.kakaoId.trim()) {
    errors.kakaoId = "카카오톡 아이디를 입력해주세요.";
    isValid = false;
  }

  if (!values.email.trim()) {
    errors.email = "이메일을 입력해주세요.";
    isValid = false;
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = "올바른 이메일 형식으로 입력해주세요.";
    isValid = false;
  }

  if (!values.password) {
    errors.password = "비밀번호를 입력해주세요.";
    isValid = false;
  } else if (!passwordPattern.test(values.password)) {
    errors.password = "비밀번호는 영문과 숫자를 포함해 8자 이상이어야 합니다.";
    isValid = false;
  }

  if (!birthDatePattern.test(values.birthDate.trim())) {
    errors.birthDate = "생년월일은 YYYY-MM-DD 형식으로 입력해주세요.";
    isValid = false;
  }

  if (!values.bio.trim()) {
    errors.bio = "자기소개를 입력해주세요.";
    isValid = false;
  } else if (values.bio.trim().length < 10) {
    errors.bio = "자기소개를 10자 이상 입력해주세요.";
    isValid = false;
  }

  return { errors, isValid };
}
