import "react-native";

declare module "react-native" {
  // Gluestack Switch forwards props to React Native Switch; add missing RN prop typing.
  interface SwitchProps {
    activeThumbColor?: string;
  }
}
