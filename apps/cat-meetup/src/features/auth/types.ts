export type Gender = "남" | "여" | "기타";

export type RegionCode = "seoul-guro" | "seoul-gwanak" | "seoul-nowon";

export type RegionOption = {
  code: RegionCode;
  label: string;
};

export type SignupFormValues = {
  name: string;
  phone: string;
  kakaoId: string;
  password: string;
  email: string;
  gender: Gender;
  birthDate: string;
  regionCode: RegionCode;
  bio: string;
};

export type SignupFieldErrors = Record<keyof SignupFormValues, string>;

export const genderOptions: Gender[] = ["남", "여", "기타"];

export const regionOptions: RegionOption[] = [
  { code: "seoul-guro", label: "서울시 구로구" },
  { code: "seoul-gwanak", label: "서울시 관악구" },
  { code: "seoul-nowon", label: "서울시 노원구" },
];

export const initialSignupFormValues: SignupFormValues = {
  name: "",
  phone: "",
  kakaoId: "",
  password: "",
  email: "",
  gender: "남",
  birthDate: "",
  regionCode: "seoul-guro",
  bio: "",
};

export const emptySignupFieldErrors: SignupFieldErrors = {
  name: "",
  phone: "",
  kakaoId: "",
  password: "",
  email: "",
  gender: "",
  birthDate: "",
  regionCode: "",
  bio: "",
};
