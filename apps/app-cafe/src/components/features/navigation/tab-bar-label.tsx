import { Text } from "react-native";

export default function TabBarLabel({
  focused,
  color,
  children,
}: {
  focused: boolean;
  color: string;
  children: string;
}) {
  return (
    <Text
      style={{
        color,
        fontSize: 10,
        fontWeight: focused ? "700" : "500",
        marginTop: 4,
        lineHeight: 12,
      }}
    >
      {children}
    </Text>
  );
}
