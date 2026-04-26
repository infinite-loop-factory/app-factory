import type * as ImagePicker from "expo-image-picker";

import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useFindCourse } from "@/api/reactQuery/course/useFindCourse";
import { useUpdateReview } from "@/api/reactQuery/review/useUpdateReview";
import RatingSelector from "@/components/atoms/RatingSelector";
import CustomSafeAreaView from "@/components/CustomSafeAreaView";
import { getGlobalHandleToast } from "@/components/CustomToast";
import CoursePreviewCard from "@/components/card/CoursePreviewCard";
import HeaderBar from "@/components/HeaderBar";
import ImagePickerGroup from "@/components/molecules/ImagePickerGroup";
import TextareaField from "@/components/molecules/TextareaField";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useUploadImages } from "@/hooks/useUploadImages";

export default function ReviewEditScreen() {
  const { reviewId, courseId, initialRate, initialContent, initialImages } =
    useLocalSearchParams<{
      reviewId: string;
      courseId: string;
      initialRate: string;
      initialContent: string;
      initialImages: string;
    }>();

  const { data } = useFindCourse(Number(courseId));
  const { image_url = "", start_name = "", end_name = "" } = data || {};

  const [rate, setRate] = useState(Number(initialRate ?? 5));
  const [reviewText, setReviewText] = useState(initialContent ?? "");

  // NOTE: 기존 이미지 URL을 ImagePickerAsset mock으로 변환해서 초기값 설정
  const parsedExistingImages: string[] = initialImages
    ? JSON.parse(initialImages)
    : [];
  const [reviewImages, setReviewImages] = useState<
    ImagePicker.ImagePickerAsset[]
  >(
    parsedExistingImages.map(
      (uri) => ({ uri }) as ImagePicker.ImagePickerAsset,
    ),
  );

  const { handleUploadImages } = useUploadImages();
  const { mutateAsync: updateReview } = useUpdateReview();

  const handleReviewSubmit = async () => {
    try {
      // NOTE: base64가 있는 이미지만 새로 업로드, 없으면 기존 URL 사용
      const newImages = reviewImages.filter((img) => img.base64);
      const keptUrls = reviewImages
        .filter((img) => !img.base64)
        .map((img) => img.uri);

      const { uploadedUrls: newUrls } = await handleUploadImages(newImages);
      const parsedNewUrls: string[] = newUrls ? JSON.parse(newUrls) : [];
      const finalImages = JSON.stringify([...keptUrls, ...parsedNewUrls]);

      await updateReview({
        reviewId: Number(reviewId),
        courseId: Number(courseId),
        rate,
        content: reviewText,
        images: finalImages,
      });

      getGlobalHandleToast("리뷰가 수정되었습니다.");
      router.back();
    } catch {
      getGlobalHandleToast("리뷰 수정에 실패했습니다.");
    }
  };

  return (
    <CustomSafeAreaView>
      <HeaderBar isShowBackButton={true} title={"리뷰 수정"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView className="flex-1">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <VStack className="h-full flex-1 gap-6 px-6 pt-6">
              <CoursePreviewCard
                endName={end_name}
                imageUrl={image_url}
                startName={start_name}
              />
              <VStack className="items-center gap-2">
                <Text className="font-semibold text-lg">
                  이 산책 코스는 어떠셨나요?
                </Text>
                <Text className="text-slate-500 text-sm">
                  별점을 선택해주세요
                </Text>
                <RatingSelector rate={rate} setRate={setRate} />
              </VStack>
              <TextareaField
                helperText={"최소 10자 이상 작성해주세요"}
                maxLength={500}
                placeholder={
                  "산책 코스에 대한 솔직한 후기를 남겨주세요.\n다른 댕댕이들에게 도움이 될 거예요!"
                }
                setValue={setReviewText}
                title={"상세 리뷰"}
                value={reviewText}
              />
              <VStack className="gap-2">
                <Text className="font-medium">사진 추가 (선택사항)</Text>
                <Text className="mb-2 text-slate-500 text-sm">
                  새 사진을 선택하면 기존 사진이 교체됩니다 (최대 3장)
                </Text>
                <ImagePickerGroup
                  images={reviewImages}
                  maxLength={3}
                  setImages={setReviewImages}
                />
              </VStack>
            </VStack>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
      <View className="border-slate-100 border-t p-6">
        <Button
          className="rounded-xl"
          isDisabled={reviewText.trim().length < 10}
          onPress={handleReviewSubmit}
          size="xl"
        >
          <ButtonText>수정 완료</ButtonText>
        </Button>
      </View>
    </CustomSafeAreaView>
  );
}
