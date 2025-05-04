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
    title: "독서 모임",
    members: "멤버 1,240명",
    tag: "독서",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "2",
    title: "러닝 크루",
    members: "멤버 890명",
    tag: "운동",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "3",
    title: "반려견 사랑",
    members: "멤버 2,100명",
    tag: "반려동물",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "4",
    title: "홍 베이킹",
    members: "멤버 760명",
    tag: "요리",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "5",
    title: "영화 감상 모임",
    members: "멤버 1,560명",
    tag: "영화",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "6",
    title: "등산 동호회",
    members: "멤버 980명",
    tag: "운동",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "7",
    title: "고양이 집사들",
    members: "멤버 1,850명",
    tag: "반려동물",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "8",
    title: "한식 요리교실",
    members: "멤버 670명",
    tag: "요리",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "9",
    title: "사진 촬영반",
    members: "멤버 920명",
    tag: "사진",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "10",
    title: "여행 동호회",
    members: "멤버 1,340명",
    tag: "여행",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "11",
    title: "클래식 감상회",
    members: "멤버 580명",
    tag: "음악",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "12",
    title: "가드닝 클럽",
    members: "멤버 730명",
    tag: "원예",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "13",
    title: "DIY 공방",
    members: "멤버 850명",
    tag: "공예",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "14",
    title: "보드게임 모임",
    members: "멤버 1,120명",
    tag: "게임",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "15",
    title: "외국어 스터디",
    members: "멤버 940명",
    tag: "어학",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "16",
    title: "명상 모임",
    members: "멤버 460명",
    tag: "힐링",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "17",
    title: "서예 동호회",
    members: "멤버 380명",
    tag: "예술",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "18",
    title: "테니스 클럽",
    members: "멤버 820명",
    tag: "운동",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "19",
    title: "와인 테이스팅",
    members: "멤버 640명",
    tag: "음식",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "20",
    title: "코딩 스터디",
    members: "멤버 1,080명",
    tag: "IT",
    image: require("../../assets/images/react-logo.png"),
  },
];

const categories = [
  {
    id: "1",
    title: "취미",
    icon: require("../../assets/images/react-logo.png"),
  },
  {
    id: "2",
    title: "운동",
    icon: require("../../assets/images/react-logo.png"),
  },
  {
    id: "3",
    title: "독서",
    icon: require("../../assets/images/react-logo.png"),
  },
  {
    id: "4",
    title: "맛집",
    icon: require("../../assets/images/react-logo.png"),
  },
  {
    id: "5",
    title: "반려동물",
    icon: require("../../assets/images/react-logo.png"),
  },
];

const posts = [
  {
    id: "1",
    title: "홍 베이킹",
    description: "집에서 만드는 달콤한 디저트",
    comments: "댓글 120개",
    time: "1시간 전",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "2",
    title: "영화 감상",
    description: "다양한 장르의 영화 리뷰와 추천",
    comments: "댓글 340개",
    time: "2시간 전",
    image: require("../../assets/images/react-logo.png"),
  },
  {
    id: "3",
    title: "여행 이야기",
    description: "국내외 여행 정보 공유",
    comments: "댓글 210개",
    time: "3시간 전",
    image: require("../../assets/images/react-logo.png"),
  },
];

const RecommendedCafeItem = ({ item }: RecommendedCafeItemProps) => {
  return (
    <TouchableOpacity className="mr-3 mb-4 w-36">
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

const PostItem = ({ item }: PostItemProps) => (
  <TouchableOpacity className="flex-row border-gray-200 border-b p-4">
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
              오늘 읽은 책 추천합니다
            </Text>
            <Text className="text-gray-400 text-xs">독서 모임 · 책토론</Text>
          </View>
          <Text className="text-gray-400 text-xs">댓글 24개</Text>
        </View>

        <View className="border-gray-200 border-b p-4">
          <Text className="mb-2 font-semibold text-base">
            주말 러닝 코스 공유해요
          </Text>
          <Text className="text-gray-400 text-xs">댓글 18개</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
