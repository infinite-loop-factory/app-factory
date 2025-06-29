import { Stack } from "expo-router";
import {
  ChevronRight,
  Coffee,
  Heart,
  type LucideIcon,
  Settings,
  ShoppingBag,
  Star,
  User,
} from "lucide-react-native";
import { useState } from "react";
import { Image, Modal, Pressable, ScrollView, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TouchableOpacity } from "react-native";

interface MenuItem {
  icon: LucideIcon;
  label: string;
  onPress?: () => void;
}

interface RecentOrder {
  id: string;
  name: string;
  price: string;
  date: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  image: any;
}

const recentOrders: RecentOrder[] = [
  {
    id: "1",
    name: "아메리카노",
    price: "4,500원",
    date: "2024.03.20",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "2",
    name: "카페라떼",
    price: "5,000원",
    date: "2024.03.19",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "3",
    name: "카푸치노",
    price: "5,500원",
    date: "2024.03.18",
    image: require("../../assets/images/react-logo.png"),
  },
];

const MenuItem = ({ icon: Icon, label, onPress }: MenuItem) => (
  <TouchableOpacity
    className="flex-row items-center justify-between py-3"
    onPress={onPress}
  >
    <ThemedView className="flex-row items-center">
      <Icon size={20} className="mr-3 text-gray-600" />
      <ThemedText>{label}</ThemedText>
    </ThemedView>
    <ChevronRight size={20} className="text-gray-400" />
  </TouchableOpacity>
);

export default function MyPage() {
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const menuItems: MenuItem[] = [
    { icon: ShoppingBag, label: "주문 내역" },
    { icon: Star, label: "즐겨찾기" },
    {
      icon: Settings,
      label: "설정",
      onPress: () => setIsBottomSheetVisible(true),
    },
    { icon: Heart, label: "자주 가는 카페" },
    { icon: Coffee, label: "선호하는 메뉴" },
  ];
  return (
    <>
      <Stack.Screen options={{ title: "마이페이지" }} />
      <ScrollView>
        <ThemedView className="flex-1">
          <ThemedView className="flex-row items-center border-gray-200 border-b p-4">
            <User size={64} className="text-gray-600" />
            <ThemedView className="ml-4">
              <ThemedText type="title">사용자님</ThemedText>
              <ThemedText className="text-gray-600">
                user@example.com
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView className="p-4">
            <ThemedText type="subtitle" className="mb-2">
              나의 설정
            </ThemedText>
            {menuItems.map((item, index) => (
              <MenuItem key={`${String(index)}`} {...item} />
            ))}
          </ThemedView>

          <ThemedView className="p-4">
            <ThemedText type="subtitle" className="mb-2">
              최근 주문
            </ThemedText>
            <ThemedView className="space-y-2">
              {recentOrders.map((order) => (
                <ThemedView
                  key={order.id}
                  className="flex-row items-center rounded-lg bg-gray-100 p-4"
                >
                  <Image
                    source={order.image}
                    className="h-16 w-16 rounded-lg"
                  />
                  <ThemedView className="ml-4 flex-1">
                    <ThemedText className="font-bold">{order.name}</ThemedText>
                    <ThemedText className="text-gray-600">
                      {order.price}
                    </ThemedText>
                    <ThemedText className="text-gray-400 text-sm">
                      {order.date}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ScrollView>

      <Modal
        visible={isBottomSheetVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsBottomSheetVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/50"
          onPress={() => setIsBottomSheetVisible(false)}
        >
          <View className="mt-auto rounded-t-xl bg-white p-4">
            <ThemedView className="p-4">
              <ThemedText type="title" className="mb-4">
                설정
              </ThemedText>

              <ThemedView className="mb-6 space-y-4">
                <ThemedView className="border-b pb-3">
                  <ThemedText className="mb-2 font-bold">계정 설정</ThemedText>
                  <TouchableOpacity className="py-2">
                    <ThemedText>프로필 수정</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity className="py-2">
                    <ThemedText>비밀번호 변경</ThemedText>
                  </TouchableOpacity>
                </ThemedView>

                <ThemedView className="border-b pb-3">
                  <ThemedText className="mb-2 font-bold">알림 설정</ThemedText>
                  <TouchableOpacity className="py-2">
                    <ThemedText>푸시 알림</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity className="py-2">
                    <ThemedText>마케팅 수신 동의</ThemedText>
                  </TouchableOpacity>
                </ThemedView>

                <ThemedView className="border-b pb-3">
                  <ThemedText className="mb-2 font-bold">앱 설정</ThemedText>
                  <TouchableOpacity className="py-2">
                    <ThemedText>언어 설정</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity className="py-2">
                    <ThemedText>다크 모드</ThemedText>
                  </TouchableOpacity>
                </ThemedView>

                <ThemedView>
                  <ThemedText className="mb-2 font-bold">기타</ThemedText>
                  <TouchableOpacity className="py-2">
                    <ThemedText>이용약관</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity className="py-2">
                    <ThemedText>개인정보 처리방침</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity className="py-2">
                    <ThemedText className="text-red-500">로그아웃</ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>

              <TouchableOpacity
                style={{
                  backgroundColor: "#e5e7eb",
                  alignItems: "center",
                  paddingVertical: 12,
                  borderRadius: 8,
                }}
                onPress={() => setIsBottomSheetVisible(false)}
              >
                <ThemedText className="font-bold">닫기</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
