import { Stack, useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

const Measurement: React.FC = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen options={{ title: "측정 페이지" }} />
      <Text style={{ fontSize: 24, marginBottom: 20 }}>측정 페이지</Text>
      <Button title="뒤로 가기" onPress={() => router.back()} />
    </View>
  );
};

export default Measurement;
