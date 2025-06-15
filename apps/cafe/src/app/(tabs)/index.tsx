import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  type ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface RecommendedCafe {
  id: string;
  title: string;
  members: string;
  tag: string;
  image: ImageSourcePropType;
}

interface Post {
  id: string;
  title: string;
  description: string;
  comments: string;
  time: string;
  image: ImageSourcePropType;
}

interface RecommendedCafeItemProps {
  item: RecommendedCafe;
}

interface CategoryItemProps {
  item: {
    icon: ImageSourcePropType;
    title: string;
  };
}

interface PostItemProps {
  item: Post;
}

interface TabButtonProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
}

const recommendedCafes = [
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

const categories = [
  {
    id: "1",
    title: "아메리카노",
    icon: require("../../assets/images/react-logo.png"),
  },
  {
    id: "2",
    title: "카페라떼",
    icon: require("../../assets/images/react-logo.png"),
  },
  {
    id: "3",
    title: "에스프레소",
    icon: require("../../assets/images/react-logo.png"),
  },
  {
    id: "4",
    title: "카푸치노",
    icon: require("../../assets/images/react-logo.png"),
  },
  {
    id: "5",
    title: "콜드브루",
    icon: require("../../assets/images/react-logo.png"),
  },
];
const posts = [
  {
    id: "1",
    title: "스타벅스 강남점",
    description: "트렌디한 분위기의 프리미엄 카페",
    comments: "댓글 120개",
    time: "1시간 전",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "2",
    title: "블루보틀 삼청동점",
    description: "감각적인 분위기의 로스터리 카페",
    comments: "댓글 340개",
    time: "2시간 전",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "3",
    title: "커피브루잉컴퍼니",
    description: "고급스러운 원두 전문 카페",
    comments: "댓글 210개",
    time: "3시간 전",
    image: require("../../assets/images/react-logo.png"),
  },
];
const RecommendedCafeItem = ({ item }: RecommendedCafeItemProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="mr-3 mb-4 w-36"
      onPress={() => router.push(`/cafe/${item.id}`)}
    >
      <View className="relative h-32 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-200">
        <Image
          source={item.image}
          className="h-full w-full"
          resizeMode="center"
        />
        <View className="absolute top-2 right-2 rounded bg-black/60 px-2 py-1">
          <Text className="text-white text-xs">{item.tag}</Text>
        </View>
      </View>
      <Text className="mt-2 font-semibold text-sm">{item.title}</Text>
      <Text className="mt-0.5 text-gray-500 text-xs">{item.members}</Text>
    </TouchableOpacity>
  );
};

const CategoryItem = ({ item }: CategoryItemProps) => (
  <TouchableOpacity className="mx-auto flex w-full flex-grow items-center">
    <Image source={item.icon} className="h-10 w-10" resizeMode="contain" />
    <Text className="mt-2 text-xs">{item.title}</Text>
  </TouchableOpacity>
);

const PostItem = ({ item }: PostItemProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="flex-row border-gray-200 border-b p-4"
      onPress={() => router.push(`/cafe/${item.id}`)}
    >
      <Image source={item.image} className="h-15 w-15 rounded bg-gray-200" />
      <View className="ml-3 flex-1 flex-row justify-between">
        <View>
          <Text className="mb-1 font-semibold text-base">{item.title}</Text>
          <Text className="mb-1 text-gray-600 text-sm">{item.description}</Text>
          <Text className="text-gray-400 text-xs">{item.comments}</Text>
        </View>
        <Text className="text-gray-400 text-xs">{item.time}</Text>
      </View>
    </TouchableOpacity>
  );
};

const TabButton = ({ title, isActive, onPress }: TabButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-1 items-center py-3 ${isActive ? "border-black border-b-2" : ""}`}
  >
    <Text
      className={`${isActive ? "font-semibold text-black" : "text-gray-400"}`}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState("인기 카페");

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={["right", "left"]}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="font-bold text-lg">추천 카페</Text>
        <TouchableOpacity>
          <Text className="text-gray-500 text-xs">더 많은 추천 카페 보기</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={[...recommendedCafes]}
          renderItem={({ item }) => <RecommendedCafeItem item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 16, alignItems: "center" }}
        />

        <View className="mt-4 px-4">
          <Text className="mb-3 font-bold text-base">카테고리</Text>
          <FlatList
            data={categories}
            renderItem={({ item }) => <CategoryItem item={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingVertical: 8,
              flexGrow: 1,
              justifyContent: "space-between",
            }}
          />
        </View>

        <View className="mt-6 flex-row border-gray-200 border-b">
          <TabButton
            title="인기 카페"
            isActive={activeTab === "인기 카페"}
            onPress={() => setActiveTab("인기 카페")}
          />
          <TabButton
            title="새로운 카페"
            isActive={activeTab === "새로운 카페"}
            onPress={() => setActiveTab("새로운 카페")}
          />
          <TabButton
            title="가입한 카페"
            isActive={activeTab === "가입한 카페"}
            onPress={() => setActiveTab("가입한 카페")}
          />
        </View>

        <View className="mt-4">
          {posts.map((post) => (
            <PostItem key={post.id} item={post} />
          ))}
        </View>
        <View className="border-gray-200 border-b p-4">
          <View className="mb-2 flex-row items-center">
            <Text className="mr-2 font-semibold text-base">
              신메뉴 출시 - 피스타치오 라떼
            </Text>
            <Text className="text-gray-400 text-xs">신메뉴 · 이벤트</Text>
          </View>
          <Text className="text-gray-400 text-xs">댓글 45개</Text>
        </View>

        <View className="border-gray-200 border-b p-4">
          <Text className="mb-2 font-semibold text-base">
            주말 브런치 세트 할인 이벤트
          </Text>
          <Text className="text-gray-400 text-xs">댓글 32개</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
