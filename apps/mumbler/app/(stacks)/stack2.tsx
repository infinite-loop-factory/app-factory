import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function Stack2() {
  return (
    <View>
      <Stack.Screen options={{ title: "Stack2", headerShown: false }} />
      <Text>Stack2</Text>
    </View>
  );
}
