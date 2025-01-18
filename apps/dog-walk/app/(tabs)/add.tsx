import CustomSafeAreaView from "@/components/CustomSafeAriaView";
import DatePickerModal from "@/components/DatePickerModal";
import HeaderBar from "@/components/HeaderBar";
import SectionTitle from "@/components/SectionTitle";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import RNDateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import {
  Calendar as CalendarIcon,
  Camera,
  MapPinPlusInside,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddScreen() {
  const [image, setImage] = useState<string | null>(null);

  const [date, setDate] = useState(new Date());

  const [showPicker, setShowPicker] = useState(false);

  // FIXME: 산책코스 관련 구현 필요
  const [startSpot, _setStartSpot] = useState({});
  const [endSpot, _setEndSpot] = useState({});

  const [description, setDescription] = useState("");

  const [isRegistrationEnabled, setIsRegistrationEnabled] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result && !result.canceled) {
      setImage((result.assets[0] ?? { uri: "" }).uri);
    }
  };

  const onChangeDatePicker = (
    _event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (!selectedDate) return;
    setShowPicker(false);
    setDate(selectedDate);
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  useEffect(() => {
    if (date && startSpot && endSpot && image && description) {
      setIsRegistrationEnabled(true);
    } else {
      setIsRegistrationEnabled(false);
    }
  }, [date, startSpot, endSpot, image, description]);

  return (
    <CustomSafeAreaView>
      <HeaderBar title={"산책 코스 등록"} />
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="mt-3 rounded-xl bg-primary-100 p-4">
          <Text size={"lg"} className="mb-2 font-semibold text-primary-950">
            산책 코스를 공유해주세요!
          </Text>
          <Text>
            {
              "특별한 산책 경험을 나눠보세요.\n산책 코스와 사진, 추천하는 이유 등 유용한 정보를 함께 기록해주세요."
            }
          </Text>
        </View>

        <SectionTitle title={"다녀온 날짜"}>
          <TouchableOpacity
            onPress={showDatePicker}
            className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
          >
            <View className="flex w-full flex-row items-center justify-between">
              <View className="flex-row items-center">
                <CalendarIcon color={"#6DBE6E"} className="h-5 w-5" />
                <Text size="md" className="ml-2 text-slate-600">
                  {showPicker && Platform.OS === "android" && (
                    <RNDateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode={"date"}
                      is24Hour={true}
                      onChange={onChangeDatePicker}
                      display="spinner"
                    />
                  )}
                  {!showPicker && (
                    <Text>
                      {date.getFullYear()}.
                      {(date.getMonth() + 1).toString().padStart(2, "0")}.
                      {date.getDate().toString().padStart(2, "0")}
                    </Text>
                  )}
                </Text>
              </View>
              <Text size={"sm"} className="text-slate-400">
                선택하기
              </Text>
            </View>
          </TouchableOpacity>
        </SectionTitle>
        <SectionTitle title={"경로 추가"}>
          <TouchableOpacity>
            <View className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <View className="flex w-full flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <MapPinPlusInside color={"#6DBE6E"} className="h-5 w-5" />
                  <Text size="md" className="ml-2 text-slate-600">
                    산책 시작 위치
                  </Text>
                </View>
                <Text size={"sm"} className="text-slate-400">
                  선택하기
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="mt-2">
            <View className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <View className="flex w-full flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <MapPinPlusInside color={"#6DBE6E"} className="h-5 w-5" />
                  <Text size="md" className="ml-2 text-slate-600">
                    산책 종료 위치
                  </Text>
                </View>
                <Text size={"sm"} className="text-slate-400">
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
            {!image && (
              <View className="flex h-full w-full flex-col items-center justify-center gap-2">
                <Camera color={"#6DBE6E"} className="h-6 w-6" />
                <Text className="text-slate-600">사진 추가</Text>
              </View>
            )}
            {image && <Image src={image} className="h-72 w-72 rounded-xl" />}
          </TouchableOpacity>
        </SectionTitle>
        <SectionTitle title={"추천 이유"}>
          <Textarea>
            <TextareaInput
              placeholder="산책 코스를 추천하는 이유에 대해 작성해주세요."
              className="align-top"
              value={description}
              onChangeText={setDescription}
            />
          </Textarea>
        </SectionTitle>
      </ScrollView>
      <View className="p-3">
        <Button
          size={"xl"}
          className="rounded-xl"
          isDisabled={!isRegistrationEnabled}
        >
          <ButtonText>등록하기</ButtonText>
        </Button>
      </View>
      {/* NOTE: MODAL ==> */}
      <DatePickerModal
        showModal={showPicker && Platform.OS === "ios"}
        setShowModal={setShowPicker}
        date={date}
        setDate={setDate}
      />
      {/* NOTE: <== MODAL  */}
    </CustomSafeAreaView>
  );
}
