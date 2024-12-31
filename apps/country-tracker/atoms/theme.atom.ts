import AsyncStorage from "@react-native-async-storage/async-storage";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

// 테마 타입 정의
type Theme = "light" | "dark";
const storage = createJSONStorage<Theme>(() => AsyncStorage);

export const themeAtom = atomWithStorage<Theme>("theme", "light", storage);
