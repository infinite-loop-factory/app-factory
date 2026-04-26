import type { ImagePickerAsset } from "expo-image-picker";

import { decode } from "base64-arraybuffer";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useAtomValue } from "jotai";
import { Camera } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useFindCourse } from "@/api/reactQuery/course/useFindCourse";
import { useUpdateCourse } from "@/api/reactQuery/course/useUpdateCourse";
import { supabase } from "@/api/supabaseClient";
import { userAtom } from "@/atoms/userAtom";
import CustomSafeAreaView from "@/components/CustomSafeAreaView";
import { getGlobalHandleToast } from "@/components/CustomToast";
import DatePickerModal from "@/components/DatePickerModal";
import HeaderBar from "@/components/HeaderBar";
import DatePicker from "@/components/molecules/DatePicker";
import SectionTitle from "@/components/SectionTitle";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { useKeyboardHeight } from "@/hooks/useKeyboardHeight";

export default function CourseEditScreen() {
  const { id } = useLocalSearchParams();
  const courseId = Number(id);
  const keyboardHeight = useKeyboardHeight();

  const userInfo = useAtomValue(userAtom);
  const { data: courseData } = useFindCourse(courseId, userInfo.id);
  const { mutateAsync: updateCourse } = useUpdateCourse();

  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<ImagePickerAsset[]>([]);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NOTE: 기존 코스 데이터 초기값 설정
  useEffect(() => {
    if (!courseData) return;
    setDate(new Date(courseData.visited_date));
    setDescription(courseData.recommend_reason ?? "");
    setExistingImageUrl(courseData.image_url ?? "");
  }, [courseData]);

  const currentImageUri = image[0]?.uri ?? existingImageUrl;
  const isUpdateEnabled = description.trim().length > 0 && !!currentImageUri;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (result && !result.canceled && result.assets[0]) {
      setImage([result.assets[0]]);
    }
  };

  const uploadImage = async (asset: ImagePickerAsset): Promise<string> => {
    if (!asset.base64) throw new Error("이미지를 처리할 수 없습니다.");

    const fileExt = asset.uri.split(".").pop();
    const filePath = `private/${Date.now()}.${fileExt}`;
    const fileData = decode(asset.base64);

    const { error } = await supabase.storage
      .from("dog-walk-images")
      .upload(filePath, fileData, {
        contentType: asset.mimeType,
        upsert: true,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("dog-walk-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const onPressUpdate = async () => {
    setIsSubmitting(true);
    try {
      let imageUrl = existingImageUrl;

      // NOTE: 새 이미지를 선택한 경우에만 업로드
      if (image[0]) {
        imageUrl = await uploadImage(image[0]);
      }

      await updateCourse({
        courseId,
        userId: userInfo.id,
        visitedDate: date,
        imageUrl,
        recommendReason: description,
      });

      getGlobalHandleToast("산책 코스가 수정되었습니다.");
      router.back();
    } catch {
      getGlobalHandleToast("수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomSafeAreaView>
      <HeaderBar isShowBackButton={true} title={"산책 코스 수정"} />
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <SectionTitle title={"다녀온 날짜"}>
          <DatePicker date={date} setDate={setDate} />
        </SectionTitle>

        <SectionTitle title={"산책 코스 대표 사진"}>
          <TouchableOpacity
            className="flex aspect-[1/1] items-center justify-center rounded-xl bg-slate-50"
            onPress={pickImage}
          >
            {currentImageUri ? (
              <Image className="h-72 w-72 rounded-xl" src={currentImageUri} />
            ) : (
              <View className="flex h-full w-full flex-col items-center justify-center gap-2">
                <Camera className="h-6 w-6" color={"#6DBE6E"} />
                <Text className="text-slate-600">사진 추가</Text>
              </View>
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
      <View className="p-3" style={{ marginBottom: keyboardHeight }}>
        <Button
          className="rounded-xl"
          isDisabled={!isUpdateEnabled || isSubmitting}
          onPress={onPressUpdate}
          size={"xl"}
        >
          <ButtonText>수정하기</ButtonText>
        </Button>
      </View>
      {/* NOTE: MODAL ==> */}
      <DatePickerModal
        date={date}
        setDate={setDate}
        setShowModal={setShowPicker}
        showModal={showPicker && Platform.OS === "ios"}
      />
      {/* NOTE: <== MODAL */}
    </CustomSafeAreaView>
  );
}
