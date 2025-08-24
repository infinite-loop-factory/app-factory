import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useAtom, useAtomValue } from "jotai";
import { Camera, MapPinPlusInside } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { endPointAtom, startPointAtom } from "@/atoms/pointAtom";
import { userAtom } from "@/atoms/userAtom";
import CustomSafeAreaView from "@/components/CustomSafeAriaView";
import DatePickerModal from "@/components/DatePickerModal";
import HeaderBar from "@/components/HeaderBar";
import DatePicker from "@/components/molecules/DatePicker";
import SectionTitle from "@/components/SectionTitle";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { useRegisterWalkingCourse } from "@/hooks/useRegisterWalkingCourse";

export default function AddScreen() {
  const userInfo = useAtomValue(userAtom);

  const [startPoint, setStartPoint] = useAtom(startPointAtom);
  const [endPoint, setEndPoint] = useAtom(endPointAtom);

  const [image, setImage] = useState<ImagePicker.ImagePickerAsset[]>([]);

  const [date, setDate] = useState(new Date());

  const [showPicker, setShowPicker] = useState(false);

  const [description, setDescription] = useState("");

  const { handleRegister } = useRegisterWalkingCourse();

  const isRegistrationEnabled =
    date &&
    startPoint?.name &&
    endPoint?.name &&
    image.length > 0 &&
    description.trim().length > 0;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (result && !result.canceled && result.assets[0]) {
      const courseImage = result.assets[0];

      setImage(() => [courseImage]);
    }
  };

  // NOTE: 산책 코스 등록 화면 언마운트시 전역변수 초기화
  useEffect(() => {
    return () => {
      setStartPoint(null);
      setEndPoint(null);
    };
  }, [setStartPoint, setEndPoint]);

  const onPressRegister = () => {
    if (!(startPoint && endPoint)) return;

    handleRegister({
      userId: userInfo.id,
      visitedDate: date,
      start: {
        name: startPoint.name,
        lat: startPoint.latitude,
        lng: startPoint.longitude,
      },
      end: {
        name: endPoint.name,
        lat: endPoint.latitude,
        lng: endPoint.longitude,
      },
      courseImage: image,
      recommendReason: description,
    });
  };

  return (
    <CustomSafeAreaView>
      <HeaderBar title={"산책 코스 등록"} />
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="mt-3 rounded-xl bg-primary-100 p-4">
          <Text className="mb-2 font-semibold text-primary-950" size={"lg"}>
            산책 코스를 공유해주세요!
          </Text>
          <Text>
            {
              "특별한 산책 경험을 나눠보세요.\n산책 코스와 사진, 추천하는 이유 등 유용한 정보를 함께 기록해주세요."
            }
          </Text>
        </View>

        <SectionTitle title={"다녀온 날짜"}>
          <DatePicker date={date} setDate={setDate} />
        </SectionTitle>

        <SectionTitle title={"경로 추가"}>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/(screens)/location/search",
                params: {
                  type: "START",
                },
              });
            }}
          >
            <View className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <View className="flex w-full flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <MapPinPlusInside className="h-5 w-5" color={"#6DBE6E"} />
                  <Text className="ml-2 text-slate-600" size="md">
                    {startPoint?.name ?? "산책 시작 위치"}
                  </Text>
                </View>
                <Text className="text-slate-400" size={"sm"}>
                  선택하기
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className="mt-2"
            onPress={() => {
              router.push({
                pathname: "/(screens)/location/search",
                params: {
                  type: "END",
                },
              });
            }}
          >
            <View className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <View className="flex w-full flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <MapPinPlusInside className="h-5 w-5" color={"#6DBE6E"} />
                  <Text className="ml-2 text-slate-600" size="md">
                    {endPoint?.name ?? "산책 종료 위치"}
                  </Text>
                </View>
                <Text className="text-slate-400" size={"sm"}>
                  선택하기
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </SectionTitle>
        <SectionTitle title={"산책 코스 대표 사진"}>
          <TouchableOpacity
            className="flex aspect-[1/1] items-center justify-center rounded-xl bg-slate-50"
            onPress={pickImage}
          >
            {image.length === 0 && (
              <View className="flex h-full w-full flex-col items-center justify-center gap-2">
                <Camera className="h-6 w-6" color={"#6DBE6E"} />
                <Text className="text-slate-600">사진 추가</Text>
              </View>
            )}
            {image.length > 0 && (
              <Image className="h-72 w-72 rounded-xl" src={image[0]?.uri} />
            )}
          </TouchableOpacity>
        </SectionTitle>
        <SectionTitle title={"추천 이유"}>
          <Textarea>
            <TextareaInput
              className="align-top"
              onChangeText={setDescription}
              placeholder="산책 코스를 추천하는 이유에 대해 작성해주세요."
              value={description}
            />
          </Textarea>
        </SectionTitle>
      </ScrollView>
      <View className="p-3">
        <Button
          className="rounded-xl"
          isDisabled={!isRegistrationEnabled}
          onPress={onPressRegister}
          size={"xl"}
        >
          <ButtonText>등록하기</ButtonText>
        </Button>
      </View>
      {/* NOTE: MODAL ==> */}
      <DatePickerModal
        date={date}
        setDate={setDate}
        setShowModal={setShowPicker}
        showModal={showPicker && Platform.OS === "ios"}
      />
      {/* NOTE: <== MODAL  */}
    </CustomSafeAreaView>
  );
}
