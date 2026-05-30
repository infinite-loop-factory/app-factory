import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const C = {
  primary: "#3d6bf5",
  surface: "#F7F8FA",
  card: "#FFFFFF",
  border: "#E5E8EB",
  textMain: "#191F28",
  textSub: "#6B7684",
};

const navigationItems = [
  {
    href: "/food",
    icon: "lunch-dining",
    eyebrow: "오늘의 선택",
    title: "흔들어서 맛집 추천",
    description: "위치와 검색 반경을 바탕으로 가까운 맛집을 골라드려요.",
  },
  {
    href: "/lotto",
    icon: "confirmation-number",
    eyebrow: "행운의 숫자",
    title: "로또 번호 추첨",
    description: "흔들거나 버튼을 눌러 행운의 번호 6개를 뽑아보세요.",
  },
] as const;

export default function IndexScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          gap: 24,
          paddingHorizontal: 24,
          paddingTop: 48,
          paddingBottom: 32,
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="gap-3">
          <Text
            className="font-extrabold text-3xl"
            style={{ color: C.textMain, lineHeight: 40 }}
          >
            어떤 기능을{"\n"}열어볼까요?
          </Text>
          <Text className="font-medium text-base" style={{ color: C.textSub }}>
            원하는 기능을 선택해 바로 시작하세요.
          </Text>
        </View>

        <View className="gap-3">
          {navigationItems.map((item) => (
            <Link asChild href={item.href} key={item.href}>
              <Pressable
                className="flex-row items-center gap-4 rounded-lg border p-4"
                style={{
                  backgroundColor: C.card,
                  borderColor: C.border,
                  boxShadow: "0 6px 18px rgba(25, 31, 40, 0.08)",
                }}
              >
                <View
                  className="h-12 w-12 items-center justify-center rounded-lg"
                  style={{ backgroundColor: C.surface }}
                >
                  <MaterialIcons color={C.primary} name={item.icon} size={26} />
                </View>
                <View className="flex-1 gap-1">
                  <Text
                    className="font-bold text-xs"
                    style={{ color: C.primary }}
                  >
                    {item.eyebrow}
                  </Text>
                  <Text
                    className="font-bold text-lg"
                    style={{ color: C.textMain }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    className="font-medium text-sm"
                    style={{ color: C.textSub, lineHeight: 20 }}
                  >
                    {item.description}
                  </Text>
                </View>
                <MaterialIcons
                  color={C.textSub}
                  name="chevron-right"
                  size={24}
                />
              </Pressable>
            </Link>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
