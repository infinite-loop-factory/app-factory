import type { ModeType } from "@/components/ui/gluestack-ui-provider";

import { create } from "zustand";

interface ThemeStore {
  mode: ModeType;
  setInitialMode: (mode: ModeType) => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: "light",
  setInitialMode: (mode) => set({ mode }),
  toggleMode: () =>
    set((state) => ({ mode: state.mode === "light" ? "dark" : "light" })),
}));
