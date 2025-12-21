import { Stack, useRouter } from "expo-router";
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
import { useFavorites } from "@/hooks/use-favorites";

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

interface Cafe {
  id: string;
  title: string;
  members: string;
  tag: string;
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

// Cafe list data (matching index.tsx)
const allCafes: Cafe[] = [
  {
    id: "1",
    title: "블루보틀 커피",
    members: "멤버 2,340명",
    tag: "커피",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "2",
    title: "스타벅스 리저브",
    members: "멤버 1,890명",
    tag: "커피",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "3",
    title: "핸드드립 전문점",
    members: "멤버 980명",
    tag: "커피",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "4",
    title: "커피 로스터리",
    members: "멤버 1,260명",
    tag: "커피",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "5",
    title: "커피빈",
    members: "멤버 1,560명",
    tag: "커피",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "6",
    title: "투썸플레이스",
    members: "멤버 1,780명",
    tag: "커피",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "7",
    title: "폴 바셋",
    members: "멤버 850명",
    tag: "커피",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "8",
    title: "카페베네",
    members: "멤버 1,670명",
    tag: "커피",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "9",
    title: "이디야커피",
    members: "멤버 2,120명",
    tag: "커피",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "10",
    title: "할리스커피",
    members: "멤버 1,340명",
    tag: "커피",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "11",
    title: "매머드커피",
    members: "멤버 1,580명",
    tag: "커피",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "12",
    title: "커피베이",
    members: "멤버 930명",
    tag: "커피",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "13",
    title: "빽다방",
    members: "멤버 1,850명",
    tag: "커피",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "14",
    title: "탐앤탐스",
    members: "멤버 1,120명",
    tag: "커피",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "15",
    title: "메가커피",
    members: "멤버 1,940명",
    tag: "커피",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "16",
    title: "더벤티",
    members: "멤버 1,460명",
    tag: "커피",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "17",
    title: "컴포즈커피",
    members: "멤버 1,380명",
    tag: "커피",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "18",
    title: "요거프레소",
    members: "멤버 820명",
    tag: "커피",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "19",
    title: "커피스미스",
    members: "멤버 640명",
    tag: "커피",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "20",
    title: "앤젤리너스",
    members: "멤버 1,080명",
    tag: "커피",
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

interface LoginFormProps {
  isSignedIn: boolean;
  isLoading: boolean;
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  signIn: (email: string, password: string) => void;
  signUp: (email: string, password: string) => void;
  signInWithNaver: () => void;
}

const LoginForm = ({
  isSignedIn,
  isLoading,
  email,
  password,
  setEmail,
  setPassword,
  signIn,
  signUp,
  signInWithNaver,
}: LoginFormProps) => {
  if (isSignedIn) return null;

  return (
    <ThemedView className="border-gray-200 border-b p-4">
      <ThemedText className="mb-3 font-bold">로그인</ThemedText>

      <ThemedView className="space-y-2">
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
            marginBottom: 8,
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
            marginBottom: 8,
          }}
          value={password}
        />
        <ThemedView className="flex-row gap-2">
          <TouchableOpacity
            disabled={isLoading || !email || !password}
            onPress={() => signIn(email.trim(), password)}
            style={{
              flex: 1,
              backgroundColor:
                isLoading || !email || !password ? "#d1d5db" : "#1f2937",
              paddingVertical: 10,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <ThemedText className="font-bold text-white">로그인</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isLoading || !email || !password}
            onPress={() => signUp(email.trim(), password)}
            style={{
              flex: 1,
              backgroundColor:
                isLoading || !email || !password ? "#d1d5db" : "#4b5563",
              paddingVertical: 10,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <ThemedText className="font-bold text-white">회원가입</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      <TouchableOpacity
        disabled={isLoading}
        onPress={signInWithNaver}
        style={{
          backgroundColor: "#03C75A",
          paddingVertical: 10,
          paddingHorizontal: 12,
          borderRadius: 8,
          marginTop: 12,
        }}
      >
        <ThemedText className="text-center font-bold text-white">
          {isLoading ? "로그인 중..." : "네이버로 로그인"}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  signOut: () => void;
}

const SettingsModal = ({ visible, onClose, signOut }: SettingsModalProps) => (
  <Modal
    animationType="slide"
    onRequestClose={onClose}
    transparent={true}
    visible={visible}
  >
    <Pressable className="flex-1 bg-black/50" onPress={onClose}>
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
            onPress={onClose}
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
);

interface FavoritesModalProps {
  visible: boolean;
  onClose: () => void;
  favoriteCafes: Cafe[];
  isSignedIn: boolean;
  router: ReturnType<typeof useRouter>;
}

const FavoritesModal = ({
  visible,
  onClose,
  favoriteCafes,
  isSignedIn,
  router,
}: FavoritesModalProps) => (
  <Modal
    animationType="slide"
    onRequestClose={onClose}
    transparent={true}
    visible={visible}
  >
    <Pressable className="flex-1 bg-black/60" onPress={onClose}>
      <Pressable className="mt-auto max-h-[85%] overflow-hidden rounded-t-3xl bg-white">
        <ThemedView
          className="px-6 pt-6 pb-4"
          style={{
            backgroundColor: "#fbbf24",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <ThemedView className="flex-row items-center justify-between">
            <ThemedView className="flex-row items-center">
              <Star color="#fff" fill="#fff" size={28} />
              <ThemedText className="ml-2 font-bold text-2xl text-white">
                즐겨찾기
              </ThemedText>
            </ThemedView>
            <ThemedView
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
            >
              <ThemedText className="font-bold text-white">
                {favoriteCafes.length}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ScrollView className="px-6 py-4" showsVerticalScrollIndicator={false}>
          {favoriteCafes.length > 0 ? (
            <ThemedView className="space-y-3 pb-4">
              {favoriteCafes.map((cafe, index) => (
                <TouchableOpacity
                  className="flex-row items-center rounded-2xl bg-white p-4"
                  key={cafe.id}
                  onPress={() => {
                    onClose();
                    router.push(`/cafe/${cafe.id}`);
                  }}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 8,
                    elevation: 3,
                    borderWidth: 1,
                    borderColor: "#f3f4f6",
                  }}
                >
                  <ThemedView
                    className="relative"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
                  >
                    <Image
                      className="h-20 w-20 rounded-xl"
                      source={cafe.image}
                      style={{ backgroundColor: "#f3f4f6" }}
                    />
                    <ThemedView
                      className="-top-2 -left-2 absolute h-6 w-6 items-center justify-center rounded-full"
                      style={{ backgroundColor: "#fbbf24" }}
                    >
                      <ThemedText className="font-bold text-white text-xs">
                        {index + 1}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>

                  <ThemedView className="ml-4 flex-1">
                    <ThemedText className="mb-1 font-bold text-lg">
                      {cafe.title}
                    </ThemedText>
                    <ThemedText className="mb-2 text-gray-500 text-sm">
                      {cafe.members}
                    </ThemedText>
                    <ThemedView
                      className="self-start rounded-full px-3 py-1"
                      style={{ backgroundColor: "#fef3c7" }}
                    >
                      <ThemedText
                        className="font-semibold text-xs"
                        style={{ color: "#d97706" }}
                      >
                        {cafe.tag}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>

                  <Heart color="#ef4444" fill="#ef4444" size={24} />
                </TouchableOpacity>
              ))}
            </ThemedView>
          ) : (
            <ThemedView className="items-center justify-center py-16">
              <ThemedView
                className="mb-6 h-24 w-24 items-center justify-center rounded-full"
                style={{ backgroundColor: "#fef3c7" }}
              >
                <Star color="#fbbf24" fill="#fbbf24" size={48} />
              </ThemedView>
              <ThemedText className="mb-3 text-center font-bold text-xl">
                즐겨찾기한 카페가 없습니다
              </ThemedText>
              <ThemedText className="px-8 text-center text-base text-gray-500 leading-6">
                {isSignedIn
                  ? "마음에 드는 카페를 즐겨찾기에 추가해보세요!"
                  : "로그인하지 않아도 임시로 즐겨찾기를 사용할 수 있습니다."}
              </ThemedText>
            </ThemedView>
          )}
        </ScrollView>

        <ThemedView
          className="px-6 pt-2 pb-6"
          style={{
            borderTopWidth: 1,
            borderTopColor: "#f3f4f6",
          }}
        >
          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: "#1f2937",
              alignItems: "center",
              paddingVertical: 16,
              borderRadius: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <ThemedText className="font-bold text-base text-white">
              닫기
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </Pressable>
    </Pressable>
  </Modal>
);

export default function MyPage() {
  const router = useRouter();
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [isFavoritesModalVisible, setIsFavoritesModalVisible] = useState(false);
  const { favorites } = useFavorites();

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

  // Filter favorite cafes
  const favoriteCafes = allCafes.filter((cafe) => favorites.includes(cafe.id));

  const menuItems: MenuItem[] = [
    { icon: ShoppingBag, label: "주문 내역" },
    {
      icon: Star,
      label: "즐겨찾기",
      onPress: () => setIsFavoritesModalVisible(true),
    },
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
                  <ThemedText type="title">게스트</ThemedText>
                  <ThemedText className="text-gray-600">
                    임시 사용자 (로그인하여 모든 기능 사용)
                  </ThemedText>
                </ThemedView>
              </>
            )}
          </ThemedView>

          <LoginForm
            email={email}
            isLoading={isLoading}
            isSignedIn={isSignedIn}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            signIn={signIn}
            signInWithNaver={signInWithNaver}
            signUp={signUp}
          />

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

      <SettingsModal
        onClose={() => setIsBottomSheetVisible(false)}
        signOut={signOut}
        visible={isBottomSheetVisible}
      />

      <FavoritesModal
        favoriteCafes={favoriteCafes}
        isSignedIn={isSignedIn}
        onClose={() => setIsFavoritesModalVisible(false)}
        router={router}
        visible={isFavoritesModalVisible}
      />
    </>
  );
}
