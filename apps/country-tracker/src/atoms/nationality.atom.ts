import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";

const NATIONALITY_KEY = "user-nationality";

const baseAtom = atom<string>("");

export const nationalityAtom = atom(
  (get) => get(baseAtom),
  async (_get, set, value: string) => {
    set(baseAtom, value.toUpperCase());
    await AsyncStorage.setItem(NATIONALITY_KEY, value.toUpperCase());
  },
);

if (typeof window !== "undefined") {
  AsyncStorage.getItem(NATIONALITY_KEY).then((val) => {
    if (val) {
      baseAtom.init = val;
    }
  });
}
