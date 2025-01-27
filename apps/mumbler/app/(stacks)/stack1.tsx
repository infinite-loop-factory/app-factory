import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function Stack1() {
  return (
    <View>
      <Stack.Screen options={{ title: "Stack1", headerShown: false }} />
      <Text>Stack1</Text>
    </View>
  );
}
