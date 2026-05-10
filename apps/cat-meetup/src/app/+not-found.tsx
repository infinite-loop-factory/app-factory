import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "600" }}>
        페이지를 찾을 수 없습니다.
      </Text>
      <Link href="/" style={{ color: "#2563eb" }}>
        홈으로 이동
      </Link>
    </View>
  );
}
