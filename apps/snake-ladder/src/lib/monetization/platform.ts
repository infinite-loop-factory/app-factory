import { Platform } from "react-native";

export function isNativeStorePlatform(): boolean {
  return Platform.OS === "ios" || Platform.OS === "android";
}
