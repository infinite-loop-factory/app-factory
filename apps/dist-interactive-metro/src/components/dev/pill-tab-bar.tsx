import { Pressable, ScrollView, Text } from "react-native";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "database", label: "Database" },
  { id: "api", label: "API" },
  { id: "actions", label: "Actions" },
] as const satisfies readonly { id: string; label: string }[];

export type DevTab = (typeof TABS)[number]["id"];

export interface PillTabBarProps {
  active: DevTab;
  onChange: (tab: DevTab) => void;
}

export function PillTabBar({ active, onChange }: PillTabBarProps) {
  return (
    <ScrollView
      className="flex-row"
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 6 }}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {TABS.map((tab) => (
        <Pressable
          accessibilityLabel={`${tab.label} tab`}
          accessibilityRole="tab"
          accessibilityState={{ selected: active === tab.id }}
          className={`mr-2 rounded-full px-4 py-1.5 ${
            active === tab.id
              ? "bg-primary-500"
              : "border border-outline-200 bg-background-50"
          }`}
          key={tab.id}
          onPress={() => onChange(tab.id)}
        >
          <Text
            className={`font-semibold text-sm ${
              active === tab.id ? "text-white" : "text-outline-500"
            }`}
          >
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
