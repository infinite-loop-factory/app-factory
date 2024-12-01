import CustomSafeAreaView from "@/components/CustomSafeAriaView";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import { TouchableOpacity } from 'react-native-gesture-handler';

type TRecommendedCourseItemProp = {
  id: string;
  title: string;
  image: string;
  distance: number;
  totalTime: number;
  address: string;
};

type TLatestReviewItemProp = {
  id: string;
  image: string;
  name: string;
  review: string;
  createdAt: string;
};

export default function HomeScreen() {
  const router = useRouter();

  const screenWidth = Dimensions.get("window").width;
  const calculatedWidth = screenWidth - 110;

  const recommededCourse = [
    {
      id: "1",
      title: "도시 공원 코스 1",
      image: "http://via.placeholder.com/280",
      distance: 2.1,
      totalTime: 21,
      address: "강남구 삼성동",
    },
    {
      id: "2",
      title: "도시 공원 코스 2",
      image: "http://via.placeholder.com/280",
      distance: 2.1,
      totalTime: 21,
      address: "강남구 삼성동",
    },
    {
      id: "3",
      title: "도시 공원 코스 3",
      image: "http://via.placeholder.com/280",
      distance: 2.1,
      totalTime: 21,
      address: "강남구 삼성동",
    },
    {
      id: "4",
      title: "도시 공원 코스 4",
      image: "http://via.placeholder.com/280",
      distance: 2.1,
      totalTime: 21,
      address: "강남구 삼성동",
    },
  ];

  const latestReviews = [
    {
      id: "review_1",
      image: "http://via.placeholder.com/280",
      name: "사용자1",
      review: "이 코스는 정말 좋았어요! 강아지와 함께 걷고 경치도 너무 예뻐요.",
      createdAt: "2024-12-01 12:00",
    },
    {
      id: "review_2",
      image: "http://via.placeholder.com/280",
      name: "사용자2",
      review: "이 코스는 정말 좋았어요! 강아지와 함께 걷고 경치도 너무 예뻐요.",
      createdAt: "2024-11-30 12:00",
    },
    {
      id: "review_3",
      image: "http://via.placeholder.com/280",
      name: "사용자3",
      review: "이 코스는 정말 좋았어요! 강아지와 함께 걷고 경치도 너무 예뻐요.",
      createdAt: "2024-11-15 12:00",
    },
    {
      id: "review_4",
      image: "http://via.placeholder.com/280",
      name: "사용자4",
      review: "이 코스는 정말 좋았어요! 강아지와 함께 걷고 경치도 너무 예뻐요.",
      createdAt: "2024-10-31 12:00",
    },
  ];

  const recommendedCourseItem = ({
    item,
  }: { item: TRecommendedCourseItemProp }) => {
    const { title, distance, totalTime, image, address } = item;

    return (
      <View className=" flex w-72 flex-column overflow-hidden rounded-lg border border-slate-200">
        <Image src={image} className="h-40 w-72 " />
        <View className="flex p-4">
          <Text className="mb-2 font-semibold text-md">{title}</Text>
          <View className="flex flex-row">
            <Text className="mr-2 mb-2 text-slate-500 text-sm">
              거리 : {distance}km
            </Text>
            <Text className="mb-2 text-slate-500 text-sm">
              소요 시간 : {totalTime}분
            </Text>
          </View>
          <View className="flex flex-row items-center ">
            <Ionicons name="map-outline" className="mr-2" color={"#6DBE6E"} />
            {/* FIXME: 컬러 팔레트 정리하기 */}
            <Text className="text-[#6DBE6E] text-sm">{address}</Text>
          </View>
        </View>
      </View>
    );
  };

  const latestReviewItem = ({ item }: { item: TLatestReviewItemProp }) => {
    const { image, name, review, createdAt } = item;

    return (
      <View className="flex w-full flex-row rounded-lg border border-slate-200 p-4">
        <Image src={image} className="mr-4 h-10 w-10 rounded-full" />
        <View style={{ width: calculatedWidth }} className="flex flex-column">
          <View className="flex flex-row justify-between">
            <Text className="mb-2 font-semibold text-md">{name}</Text>
            <Text className=" text-slate-500 text-sm">{createdAt}</Text>
          </View>

          <View className="flex flex-row overflow-hidden">
            <Text
              className="mr-2 mb-2 text-slate-500 text-sm"
              numberOfLines={2}
            >
              {review}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <CustomSafeAreaView>
      <ScrollView>
        <View className="py-4">
          <Text className=" text-slate-600 text-sm">안녕하세요 👋</Text>
          <Text className="font-bold text-2xl">댕댕이와 산책해요</Text>
        </View>
        <TouchableOpacity
          className="h-12 w-full rounded-l bg-slate-50 px-2"
          onPress={() => router.push("/search")}
        >
          <View className="flex h-full flex-row items-center">
            <Ionicons name="search" className="pr-2" />
            <Text className="text-slate-500 text-sm">산책 코스 검색하기</Text>
          </View>
        </TouchableOpacity>
        <View>
          <View className="flex w-full flex-row items-center justify-between py-4">
            <Text className="font-bold text-l">추천 산책 코스</Text>
            <TouchableOpacity
              className=""
              onPress={() => router.push("/search")}
            >
              <View className="flex flex-row items-center ">
                <Text className="text-slate-500 text-sm">전체보기</Text>
                <Ionicons name="arrow-forward" className="pl-2" />
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <FlatList
              data={recommededCourse}
              renderItem={recommendedCourseItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16 }}
            />
          </View>
        </View>
        <View>
          <View className="flex w-full flex-row items-center justify-between py-4">
            <Text className="font-bold text-l">최근 리뷰</Text>
            <TouchableOpacity
              className=""
              onPress={() => router.push("/search")}
            >
              <View className="flex flex-row items-center ">
                <Text className="text-slate-500 text-sm">전체보기</Text>
                <Ionicons name="arrow-forward" className="pl-2" />
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <FlatList
              data={latestReviews}
              renderItem={latestReviewItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ gap: 16 }}
            />
          </View>
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
}
