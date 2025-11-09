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
import {
  Image,
  type ImageSourcePropType,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/features/auth/auth-context";
import { useSupabaseAuth } from "@/features/auth/supabase/auth-context";

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
  image: ImageSourcePropType;
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
      <Icon className="mr-3 text-gray-600" size={20} />
      <ThemedText>{label}</ThemedText>
    </ThemedView>
    <ChevronRight className="text-gray-400" size={20} />
  </TouchableOpacity>
);

export default function MyPage() {
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  // Naver auth
  const {
    isSignedIn: isNaverSignedIn,
    user: naverUser,
    isLoading: isNaverLoading,
    signInWithNaver,
    signOut: signOutNaver,
  } = useAuth();
  // Supabase auth
  const {
    isSignedIn: isSupabaseSignedIn,
    user: supabaseUser,
    isLoading: isSupabaseLoading,
    signIn,
    signUp,
    signOut: signOutSupabase,
  } = useSupabaseAuth();

  // Combined auth view state
  const isSignedIn = isNaverSignedIn || isSupabaseSignedIn;
  const isLoading = isNaverLoading || isSupabaseLoading;
  const user = naverUser
    ? naverUser
    : supabaseUser && {
        id: supabaseUser.id,
        email: supabaseUser.email ?? undefined,
      };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signOut = async () => {
    await Promise.allSettled([signOutSupabase(), signOutNaver()]);
  };

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
            {isSignedIn ? (
              <>
                {user?.profile_image ? (
                  <Image
                    className="h-16 w-16 rounded-full"
                    source={{ uri: user.profile_image }}
                  />
                ) : (
                  <User className="text-gray-600" size={64} />
                )}
                <ThemedView className="ml-4">
                  <ThemedText type="title">
                    {user?.nickname || user?.name || "네이버 사용자"}
                  </ThemedText>
                  {!!user?.email && (
                    <ThemedText className="text-gray-600">
                      {user.email}
                    </ThemedText>
                  )}
                </ThemedView>
              </>
            ) : (
              <>
                <User className="text-gray-600" size={64} />
                <ThemedView className="ml-4 flex-1">
                  <ThemedText type="title">로그인이 필요합니다</ThemedText>
                  <ThemedText className="text-gray-600">
                    네이버 또는 이메일로 로그인해 주세요.
                  </ThemedText>

                  {/* Supabase Email/Password Auth */}
                  <ThemedView className="mt-3 space-y-2 px-4">
                    <TextInput
                      autoCapitalize="none"
                      keyboardType="email-address"
                      onChangeText={setEmail}
                      placeholder="이메일"
                      style={{
                        borderWidth: 1,
                        borderColor: "#e5e7eb",
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        backgroundColor: "#fff",
                      }}
                      value={email}
                    />
                    <TextInput
                      onChangeText={setPassword}
                      placeholder="비밀번호"
                      secureTextEntry
                      style={{
                        borderWidth: 1,
                        borderColor: "#e5e7eb",
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        backgroundColor: "#fff",
                      }}
                      value={password}
                    />
                    <ThemedView className="mt-2 flex-row gap-2">
                      <TouchableOpacity
                        className={"border"}
                        disabled={isLoading || !email || !password}
                        onPress={() => signIn(email.trim(), password)}
                        style={{
                          flex: 1,
                          backgroundColor: "white",
                          paddingVertical: 10,
                          borderRadius: 8,
                          alignItems: "center",
                        }}
                      >
                        <ThemedText className="font-bold text-white">
                          이메일로 로그인
                        </ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className={"border"}
                        disabled={isLoading || !email || !password}
                        onPress={() => signUp(email.trim(), password)}
                        style={{
                          flex: 1,
                          backgroundColor: "white",
                          paddingVertical: 10,
                          borderRadius: 8,
                          alignItems: "center",
                        }}
                      >
                        <ThemedText className="font-bold text-white">
                          회원가입
                        </ThemedText>
                      </TouchableOpacity>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>

                {/* Naver OAuth */}
                <TouchableOpacity
                  disabled={isLoading}
                  onPress={signInWithNaver}
                  style={{
                    backgroundColor: "#03C75A",
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                  }}
                >
                  <ThemedText className="font-bold text-white">
                    {isLoading ? "로그인 중..." : "네이버로 로그인"}
                  </ThemedText>
                </TouchableOpacity>
              </>
            )}
          </ThemedView>

          <ThemedView className="p-4">
            <ThemedText className="mb-2" type="subtitle">
              나의 설정
            </ThemedText>
            {menuItems.map((item, index) => (
              <MenuItem key={`${String(index)}`} {...item} />
            ))}
          </ThemedView>

          <ThemedView className="p-4">
            <ThemedText className="mb-2" type="subtitle">
              최근 주문
            </ThemedText>
            <ThemedView className="space-y-2">
              {recentOrders.map((order) => (
                <ThemedView
                  className="flex-row items-center rounded-lg bg-gray-100 p-4"
                  key={order.id}
                >
                  <Image
                    className="h-16 w-16 rounded-lg"
                    source={order.image}
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
        animationType="slide"
        onRequestClose={() => setIsBottomSheetVisible(false)}
        transparent={true}
        visible={isBottomSheetVisible}
      >
        <Pressable
          className="flex-1 bg-black/50"
          onPress={() => setIsBottomSheetVisible(false)}
        >
          <View className="mt-auto rounded-t-xl bg-white p-4">
            <ThemedView className="p-4">
              <ThemedText className="mb-4" type="title">
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
                  <TouchableOpacity className="py-2" onPress={signOut}>
                    <ThemedText className="text-red-500">로그아웃</ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>

              <TouchableOpacity
                onPress={() => setIsBottomSheetVisible(false)}
                style={{
                  backgroundColor: "#e5e7eb",
                  alignItems: "center",
                  paddingVertical: 12,
                  borderRadius: 8,
                }}
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
