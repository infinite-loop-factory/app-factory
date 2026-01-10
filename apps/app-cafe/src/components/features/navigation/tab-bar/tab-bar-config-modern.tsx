import TabBarLabel from "@/components/features/navigation/tab-bar-label.tsx";
import { type ThemeType, themeConfig } from "@/hooks/use-theme";

export const modernTabBarConfig = ({ mode }: { mode: ThemeType }) => {
  const activeColor = themeConfig.getHex(mode, "--color-tab-bar-active");
  const inactiveColor = themeConfig.getHex(mode, "--color-tab-bar-inactive");
  const tabBarColor = themeConfig.getHex(mode, "--color-tab-bar");
  const borderColor = themeConfig.getHex(mode, "--color-primary-200");

  return {
    tabBarShowLabel: true,
    tabBarActiveTintColor: activeColor,
    tabBarInactiveTintColor: inactiveColor,
    tabBarLabel: ({
      focused,
      color,
      children,
    }: {
      focused: boolean;
      color: string;
      children: string;
    }) => (
      <TabBarLabel color={color} focused={focused}>
        {children}
      </TabBarLabel>
    ),
    tabBarStyle: {
      position: "relative" as const,

      height: 85,
      backgroundColor: tabBarColor,
      borderTopWidth: 1,
      borderTopColor: borderColor,
      elevation: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      paddingTop: 8,
      paddingBottom: 10,
    },
    tabBarItemStyle: {
      alignItems: "center" as const,
    },
    tabBarIconStyle: {
      marginBottom: 0,
      marginTop: 0,
    },
  };
};
