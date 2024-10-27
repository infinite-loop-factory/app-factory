import { Stack, useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

const Settings: React.FC = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen options={{ title: "설정 페이지" }} />
      <Text style={{ fontSize: 24, marginBottom: 20 }}>설정 페이지</Text>
      <Button title="뒤로 가기" onPress={() => router.back()} />
    </View>
  );
};

export default Settings;
