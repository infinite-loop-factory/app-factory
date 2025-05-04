import { atomWithStorage } from "jotai/utils";
import { storage } from "./utils/createStorage";

interface UserInfo {
  accessToken: string;
  refreshToken: string;
  email: string;
  name: string;
  imageUrl: string;
  id: string;
}

export const userAtom = atomWithStorage<UserInfo>(
  "userInfo",
  {
    accessToken: "",
    refreshToken: "",
    email: "",
    name: "",
    imageUrl: "",
    id: "",
  },
  storage<UserInfo>(),
);
