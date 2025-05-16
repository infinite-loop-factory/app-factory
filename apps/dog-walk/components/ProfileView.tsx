import { userAtom } from "@/atoms/userAtom";
import { useAtomValue } from "jotai/react";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import ProfileMenuItem from "./ProfileMenuItem";
import SectionTitle from "./SectionTitle";
import WalkingHistoryCard from "./card/WalikingHistoryCard";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Heading } from "./ui/heading";
import { Text } from "./ui/text";

export default function ProfileView() {
  const userInfo = useAtomValue(userAtom);

  const [dogInfo, setDogInfo] = useState({
    name: "",
    age: 11,
    breed: "푸들",
  });

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

  useEffect(() => {
    if (userInfo.name) {
      setDogInfo((prev) => ({
        ...prev,
        name: `${userInfo.name}의 댕댕이`,
      }));
    }
  }, [userInfo.name]);

  return (
    <ScrollView className="flex-1 p-6">
      <View className="pb-8">
        {/* NOTE: 강아지 프로필 ==> */}
        <View className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              source={require("../assets/images/icon.png")}
              alt="dog image"
            />
          </Avatar>
          <View>
            <Heading className="fong-semibold">{dogInfo.name}</Heading>
            <Text size={"sm"} className="text-slate-500">
              {dogInfo.age}살 • {dogInfo.breed}
            </Text>
          </View>
        </View>
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
