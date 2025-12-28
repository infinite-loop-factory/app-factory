import { create } from "zustand";
import type { ModeType } from "@/components/ui/gluestack-ui-provider";

interface ThemeStore {
  mode: ModeType;
  setMode: (mode: ModeType) => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: "light",
  setMode: (mode) => set({ mode }),
  toggleMode: () =>
    set((state) => ({
      mode: state.mode === "light" ? "dark" : "light",
    })),
}));
