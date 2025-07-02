import { useFindDogs } from "@/api/reactQuery/dogs/useFindDogs";
import { userAtom } from "@/atoms/userAtom";
import { router, useFocusEffect } from "expo-router";
import { useAtomValue } from "jotai/react";
import { Dog, PlusCircle } from "lucide-react-native";
import { useCallback, useMemo } from "react";
import { ScrollView, View } from "react-native";
import ProfileMenuItem from "./ProfileMenuItem";
import SectionTitle from "./SectionTitle";
import DogInfoCard from "./card/DogInfoCard";
import WalkingHistoryCard from "./card/WalikingHistoryCard";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button, ButtonIcon, ButtonText } from "./ui/button";
import { Heading } from "./ui/heading";
import { HStack } from "./ui/hstack";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";

export default function ProfileView() {
  const userInfo = useAtomValue(userAtom);

  const { data: dogsData, refetch: refetchDogsData } = useFindDogs(userInfo.id);

  const latestWalking = useMemo(() => {
    return [
      {
        id: "1",
        image: require("../assets/images/walking-main-1.png"),
        address: "몽마르뜨 공원 (서초구)",
        distance: 2,
        duration: 60,
      },
      {
        id: "2",
        image: require("../assets/images/walking-main-2.png"),
        address: "하늘공원 메타세콰이어길 (마포구)",
        distance: 0.9,
        duration: 21,
      },
      {
        id: "3",
        image: require("../assets/images/walking-main-3.png"),
        address: "경춘선 숲길 (노원구)",
        distance: 6.3,
        duration: 120,
      },
    ];
  }, []);

  useFocusEffect(
    useCallback(() => {
      refetchDogsData();
    }, [refetchDogsData]),
  );

  return (
    <ScrollView className="flex-1 p-6">
      <View className="pb-8">
        {/* NOTE: 강아지 프로필 ==> */}
        <View className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              source={
                userInfo.imageUrl
                  ? { uri: userInfo.imageUrl }
                  : require("../assets/images/icon.png")
              }
            />
          </Avatar>
          <View>
            <Heading className="font-semibold">{userInfo.name}</Heading>
            <Text size={"sm"} className="text-slate-500">
              {userInfo.email}
            </Text>
          </View>
        </View>

        {(dogsData ?? []).length === 0 && (
          <VStack className="mt-6 gap-4 rounded-xl bg-primary-500/10 p-6">
            <HStack className="items-center justify-between">
              <Text size={"lg"} className="font-semibold text-500">
                반려견 등록
              </Text>
              <Icon as={Dog} className="h-6 w-6 text-primary-500" />
            </HStack>
            <Text size="sm" className="text-slate-600">
              아직 등록된 반려견이 없어요. 반려견을 등록해 보세요!
            </Text>
            <Button
              className="w-full"
              onPress={() => {
                router.push("/(screens)/dog/register");
              }}
            >
              <ButtonText>반려견 등록하기</ButtonText>
            </Button>
          </VStack>
        )}

        {(dogsData ?? []).length > 0 && (
          <VStack className="mt-6 gap-4">
            <HStack className="items-center justify-between">
              <Text size="lg" className="font-semibold">
                내 반려견
              </Text>
              <Button
                variant="outline"
                size="sm"
                onPress={() => {
                  router.push("/(screens)/dog/register");
                }}
              >
                <ButtonIcon as={PlusCircle} />
                <ButtonText>추가하기</ButtonText>
              </Button>
            </HStack>

            {dogsData?.map((data) => (
              <DogInfoCard
                key={data.id}
                imageUrl={data.image_url}
                name={data.name}
                breed={data.breed}
                birthdate={data.birthdate}
                gender={data.gender}
              />
            ))}
          </VStack>
        )}

        {/* NOTE: <== 강아지 프로필 */}
        <SectionTitle title={"최근 산책"}>
          <View className="gap-4">
            {latestWalking.map((data) => (
              <WalkingHistoryCard item={data} key={data.id} />
            ))}
          </View>
        </SectionTitle>

        <SectionTitle title={"활동 내역"}>
          <View className="gap-4">
            <ProfileMenuItem title="내가 등록한 산책 코스" iconType="MAP" />
            <ProfileMenuItem title="내가 저장한 산책 코스" iconType="STAR" />
            <ProfileMenuItem title="설정" iconType="BELL" />
          </View>
        </SectionTitle>
      </View>
    </ScrollView>
  );
}
