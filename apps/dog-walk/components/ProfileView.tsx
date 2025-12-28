import { router, useFocusEffect } from "expo-router";
import { useAtomValue } from "jotai/react";
import { Dog, PlusCircle } from "lucide-react-native";
import { useCallback } from "react";
import { ScrollView, View } from "react-native";
import { useFindDogs } from "@/api/reactQuery/dogs/useFindDogs";
import { userAtom } from "@/atoms/userAtom";
import DogInfoCard from "./card/DogInfoCard";
import ProfileMenuItem from "./ProfileMenuItem";
import SectionTitle from "./SectionTitle";
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
            <Text className="text-slate-500" size={"sm"}>
              {userInfo.email}
            </Text>
          </View>
        </View>

        {(dogsData ?? []).length === 0 && (
          <VStack className="mt-6 gap-4 rounded-xl bg-primary-500/10 p-6">
            <HStack className="items-center justify-between">
              <Text className="font-semibold text-500" size={"lg"}>
                반려견 등록
              </Text>
              <Icon as={Dog} className="h-6 w-6 text-primary-500" />
            </HStack>
            <Text className="text-slate-600" size="sm">
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
              <Text className="font-semibold" size="lg">
                내 반려견
              </Text>
              <Button
                onPress={() => {
                  router.push("/(screens)/dog/register");
                }}
                size="sm"
                variant="outline"
              >
                <ButtonIcon as={PlusCircle} />
                <ButtonText>추가하기</ButtonText>
              </Button>
            </HStack>

            {dogsData?.map((data) => (
              <DogInfoCard
                birthdate={data.birthdate}
                breed={data.breed}
                gender={data.gender}
                imageUrl={data.image_url}
                key={data.id}
                name={data.name}
              />
            ))}
          </VStack>
        )}

        {/* NOTE: <== 강아지 프로필 */}

        <SectionTitle title={"활동 내역"}>
          <View className="gap-4">
            <ProfileMenuItem
              iconType="MAP"
              onPress={() => {
                router.push("/(screens)/my/walking-courses");
              }}
              title="내가 등록한 산책 코스"
            />
            <ProfileMenuItem
              iconType="STAR"
              onPress={() => {
                router.push("/(screens)/like/walking-courses");
              }}
              title="내가 찜한 산책 코스"
            />
            <ProfileMenuItem
              iconType="SETTINGS"
              onPress={() => {
                router.push("/(screens)/settings");
              }}
              title="설정"
            />
          </View>
        </SectionTitle>
      </View>
    </ScrollView>
  );
}
