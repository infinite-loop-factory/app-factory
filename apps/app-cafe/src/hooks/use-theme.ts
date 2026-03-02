import { objectEntries } from "@toss/utils";
import { create } from "zustand";
import { darkConfig } from "@/components/ui/design-token/config-dark";
import {
  lightConfig,
  type ThemeColorKeys,
} from "@/components/ui/design-token/config-light";
import {
  TAB_BAR_STYLE_ENUM,
  type TabBarStyle,
  THEME_MODE_ENUM,
  THEME_STYLE_ENUM,
  type ThemeStyle,
  type ThemeType,
} from "@/constants/theme";
import { hexToRgb } from "@/lib/color.utils";

// ------------------------------------------------------------------
// 1. Constants & Types Export
// ------------------------------------------------------------------
export {
  THEME_MODE_ENUM,
  type ThemeType,
  THEME_STYLE_ENUM,
  type ThemeStyle,
  TAB_BAR_STYLE_ENUM,
  type TabBarStyle,
};

// ------------------------------------------------------------------
// 2. Helper Functions & Static Configs (불변 데이터)
// ------------------------------------------------------------------
export const ALL_HEX_CONFIG: Record<
  ThemeType,
  Record<ThemeColorKeys, string>
> = {
  light: lightConfig,
  dark: darkConfig,
};

export const ALL_RGB_CONFIG: Record<
  ThemeType,
  Record<ThemeColorKeys, string>
> = Object.fromEntries(
  objectEntries(ALL_HEX_CONFIG).map(([mode, config]) => [
    mode,
    Object.fromEntries(objectEntries(config).map(([k, v]) => [k, hexToRgb(v)])),
  ]),
) as Record<ThemeType, Record<ThemeColorKeys, string>>;

// ------------------------------------------------------------------
// 3. Zustand Store (가변 상태 관리)
// ------------------------------------------------------------------
interface ThemeStore {
  // --- Primitive States ---
  mode: ThemeType;
  themeStyle: ThemeStyle;
  tabBarStyle: TabBarStyle;

  // --- Derived Boolean States (편의용) ---
  isDark: boolean;
  isLight: boolean;
  isTabBarModern: boolean;
  isTabBarRetro: boolean;

  // --- Derived Data States (핵심: 실시간 색상 데이터) ---
  // 함수가 아니라 "현재 적용된 객체" 자체를 저장합니다.
  currentRgb: Record<ThemeColorKeys, string>;
  currentHex: Record<ThemeColorKeys, string>;

  // --- Actions ---
  toggleTabBarStyle: () => void;
  toggleMode: () => void;
  setThemeStyle: (style: ThemeStyle) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  // [Initial State]
  mode: THEME_MODE_ENUM.LIGHT,
  isDark: false,
  isLight: true,
  themeStyle: THEME_STYLE_ENUM.SPOTLIGHT,
  tabBarStyle: TAB_BAR_STYLE_ENUM.MODERN,
  isTabBarModern: true,
  isTabBarRetro: false,

  currentRgb: ALL_RGB_CONFIG[THEME_MODE_ENUM.LIGHT],
  currentHex: ALL_HEX_CONFIG[THEME_MODE_ENUM.LIGHT],

  toggleTabBarStyle: () => {
    set((state) => {
      const newStyle =
        state.tabBarStyle === TAB_BAR_STYLE_ENUM.MODERN
          ? TAB_BAR_STYLE_ENUM.RETRO
          : TAB_BAR_STYLE_ENUM.MODERN;

      return {
        tabBarStyle: newStyle,
        isTabBarModern: newStyle === TAB_BAR_STYLE_ENUM.MODERN,
        isTabBarRetro: newStyle === TAB_BAR_STYLE_ENUM.RETRO,
      };
    });
  },

  toggleMode: () => {
    set((state) => {
      const newMode =
        state.mode === THEME_MODE_ENUM.LIGHT
          ? THEME_MODE_ENUM.DARK
          : THEME_MODE_ENUM.LIGHT;

      return {
        mode: newMode,
        isDark: newMode === THEME_MODE_ENUM.DARK,
        isLight: newMode === THEME_MODE_ENUM.LIGHT,
        currentRgb: ALL_RGB_CONFIG[newMode],
        currentHex: ALL_HEX_CONFIG[newMode],
      };
    });
  },

  setThemeStyle: (style) => {
    set({ themeStyle: style });
  },
}));

// ------------------------------------------------------------------
// 4. Static Helpers (Store 외부에서 사용할 때)
// ------------------------------------------------------------------
export const themeConfig = {
  getHex: (mode: ThemeType, key: ThemeColorKeys): string => {
    return ALL_HEX_CONFIG[mode][key];
  },

  getRgb: (mode: ThemeType, key: ThemeColorKeys): string => {
    return ALL_RGB_CONFIG[mode][key];
  },

  getHexConfig: (mode: ThemeType): Record<ThemeColorKeys, string> => {
    return ALL_HEX_CONFIG[mode];
  },

  getRgbConfig: (mode: ThemeType): Record<ThemeColorKeys, string> => {
    return ALL_RGB_CONFIG[mode];
  },
};
