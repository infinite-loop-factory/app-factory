import { useLocalSearchParams } from "expo-router";
import { memo, useMemo, useState } from "react";
import { Dimensions, FlatList, Image, ScrollView, View } from "react-native";
import { useFindCourse } from "@/api/reactQuery/course/useFindCourse";
import Images from "@/assets/images";
import IconText from "@/components/atoms/IconText";
import CustomSafeAreaView from "@/components/CustomSafeAriaView";
import DetailDescription from "@/components/organisms/DetailDescription";
import DetailHeaderBar from "@/components/organisms/DetailHeaderBar";
import DetailMap from "@/components/organisms/DetailMap";
import Loading from "@/components/organisms/Loading";
import Reviews from "@/components/organisms/Reviews";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { IconTextType, TabKeyType } from "@/types/displayType";
import { formatDistanceKm } from "@/utils/number";

export default function DetailScreen() {
  const screenWidth = Dimensions.get("window").width - 32;

  const { id } = useLocalSearchParams();

  const [selectedTab, setSelectedTab] = useState<TabKeyType>(TabKeyType.INFO);

  const [isFavorite, setIsFavorite] = useState(false);

  const { data } = useFindCourse(Number(id));

  const {
    total_time = 0,
    total_distance = 0,
    image_url = "",
    start_name = "",
    start_lat = 0,
    start_lng = 0,
    end_name = "",
    end_lat = 0,
    end_lng = 0,
    recommend_reason = "",
    average_rating = 0,
    review_count = 0,
    path_json = "",
  } = data || {};

  const tabInfo: { key: TabKeyType; title: string }[] = useMemo(() => {
    return [
      { key: TabKeyType.INFO, title: "정보" },
      { key: TabKeyType.MAP, title: "지도" },
      { key: TabKeyType.REVIEW, title: "리뷰" },
    ];
  }, []);

  const courseInfoItems: { type: IconTextType; content: string }[] = [
    {
      type: IconTextType.CLOCK,
      content: `${Math.round(total_time / 60)}분`,
    },
    {
      type: IconTextType.MAP,
      content: `${formatDistanceKm(total_distance)}km`,
    },
    {
      type: IconTextType.STAR,
      content: `${average_rating} (${review_count})`,
    },
  ];

  const TabContent = memo(({ selectedTab }: { selectedTab: TabKeyType }) => {
    switch (selectedTab) {
      case TabKeyType.INFO:
        return <DetailDescription content={recommend_reason} />;
      case TabKeyType.MAP:
        return (
          <DetailMap
            end={{ latitude: end_lat, longitude: end_lng }}
            path={path_json}
            start={{ latitude: start_lat, longitude: start_lng }}
          />
        );
      case TabKeyType.REVIEW:
        return <Reviews courseId={Number(id)} rate={average_rating} />;
      default:
        return null;
    }
  });

  if (!data) {
    return (
      <Loading
        description={
          "잠시만 기다려주세요.\n코스의 상세 정보와 리뷰를 가져오고 있어요."
        }
        tip={"산책 전에 날씨를 확인하고, 충분한 물과 배변봉투를 준비해주세요!"}
        title={"산책 코스 정보를 불러오고 있습니다"}
      />
    );
  }

  return (
    <CustomSafeAreaView>
      <DetailHeaderBar isFavorite={isFavorite} setIsFavorite={setIsFavorite} />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <VStack className="flex-1 px-4">
          <Image
            className="h-[250px] w-full rounded-2xl object-cover"
            src={image_url ? image_url : { uri: Images.walkingMainImage }}
          />

          {/* NOTE: 산책 코스 정보 */}
          <VStack className="gap-2 py-6">
            <Text className="font-bold" size={"2xl"}>
              [{start_name}] - [{end_name}] 산책 코스
            </Text>

            <IconText content={start_name} type={IconTextType.MAP} />

            <HStack className="items-center gap-4">
              {courseInfoItems.map((data) => (
                <IconText
                  content={data.content}
                  key={`info_${data.type}`}
                  type={data.type}
                />
              ))}
            </HStack>
          </VStack>

          {/* NOTE: 탭 */}
          <FlatList
            className="w-full"
            data={tabInfo}
            horizontal
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => {
              const isActive = item.key === selectedTab;

              return (
                <View style={{ width: screenWidth / 3 }}>
                  <Button
                    action={"primary"}
                    className="rounded-none"
                    onPress={() => {
                      setSelectedTab(item.key);
                    }}
                    variant={isActive ? "solid" : "outline"}
                  >
                    <ButtonText>{item.title}</ButtonText>
                  </Button>
                </View>
              );
            }}
            scrollEnabled={false}
          />

          {/* NOTE: 탭에 따라 렌더링되는 UI */}
          <TabContent selectedTab={selectedTab} />
        </VStack>
      </ScrollView>
    </CustomSafeAreaView>
  );
}
