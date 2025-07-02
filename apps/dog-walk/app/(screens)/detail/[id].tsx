import CustomSafeAreaView from "@/components/CustomSafeAriaView";
import IconText from "@/components/atoms/IconText";
import DetailDescription from "@/components/organisms/DetailDescription";
import DetailHeaderBar from "@/components/organisms/DetailHeaderBar";
import DetailMap from "@/components/organisms/DetailMap";
import Reviews from "@/components/organisms/Reviews";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { IconTextType, TabKeyType } from "@/types/displayType";
import { useLocalSearchParams } from "expo-router";
import { memo, useMemo, useRef, useState } from "react";
import { Dimensions, FlatList, Image, ScrollView, View } from "react-native";

export default function DetailScreen() {
  const screenWidth = Dimensions.get("window").width - 32;

  const { id } = useLocalSearchParams();

  const [selectedTab, setSelectedTab] = useState<TabKeyType>(TabKeyType.INFO);

  const [isFavorite, setIsFavorite] = useState(false);

  const [course, _setCourse] = useState({
    id: id,
    image: "",
    title: "서초구 산책 코스",
    address: "몽마르뜨 공원 (서초구)",
    distance: 2.1,
    totalTime: 21,
    rate: 4.8,
    reviewCount: 0,
    description:
      "몽마르뜨 공원은 강아지와 함께 산책하기에 최적의 장소입니다. 다음과 같은 이유로 반려견 산책 코스로 추천합니다.",
  });

  const tabInfo: { key: TabKeyType; title: string }[] = useMemo(() => {
    return [
      { key: TabKeyType.INFO, title: "정보" },
      { key: TabKeyType.MAP, title: "지도" },
      { key: TabKeyType.REVIEW, title: "리뷰" },
    ];
  }, []);

  const startPlace = useRef({
    longitude: 127.0022,
    latitude: 37.49328,
  }).current;

  const endPlace = useRef({
    latitude: 37.49649,
    longitude: 127.004,
  }).current;

  const courseInfoItems: { type: IconTextType; content: string }[] = [
    { type: IconTextType.CLOCK, content: `${course.totalTime}분` },
    { type: IconTextType.MAP, content: `${course.distance}km` },
    {
      type: IconTextType.STAR,
      content: `${course.rate} (${course.reviewCount})`,
    },
  ];

  const TabContent = memo(({ selectedTab }: { selectedTab: TabKeyType }) => {
    switch (selectedTab) {
      case TabKeyType.INFO:
        return <DetailDescription content={course.description} />;
      case TabKeyType.MAP:
        return <DetailMap start={startPlace} end={endPlace} />;
      case TabKeyType.REVIEW:
        return <Reviews />;
      default:
        return null;
    }
  });

  return (
    <CustomSafeAreaView>
      <DetailHeaderBar isFavorite={isFavorite} setIsFavorite={setIsFavorite} />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <VStack className="flex-1 px-4">
          <Image
            className="h-[250px] w-full rounded-2xl object-cover"
            source={require("../../../assets/images/walking-main-1.png")}
          />

          {/* NOTE: 산책 코스 정보 */}
          <VStack className="gap-2 py-6">
            <Text size={"2xl"} className="font-bold">
              {course.title}
            </Text>

            <IconText type={IconTextType.MAP} content={course.address} />

            <HStack className="items-center gap-4">
              {courseInfoItems.map((data) => (
                <IconText
                  key={`info_${data.type}`}
                  type={data.type}
                  content={data.content}
                />
              ))}
            </HStack>
          </VStack>

          {/* NOTE: 탭 */}
          <FlatList
            className="w-full"
            data={tabInfo}
            horizontal
            scrollEnabled={false}
            renderItem={({ item }) => {
              const isActive = item.key === selectedTab;

              return (
                <View style={{ width: screenWidth / 3 }}>
                  <Button
                    variant={isActive ? "solid" : "outline"}
                    action={"primary"}
                    className="rounded-none"
                    onPress={() => {
                      setSelectedTab(item.key);
                    }}
                  >
                    <ButtonText>{item.title}</ButtonText>
                  </Button>
                </View>
              );
            }}
            keyExtractor={(item) => item.key}
          />

          {/* NOTE: 탭에 따라 렌더링되는 UI */}
          <TabContent selectedTab={selectedTab} />
        </VStack>
      </ScrollView>
    </CustomSafeAreaView>
  );
}
