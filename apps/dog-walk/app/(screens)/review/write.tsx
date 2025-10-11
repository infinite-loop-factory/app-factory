import type { PostgrestError } from "@supabase/supabase-js";
import type * as ImagePicker from "expo-image-picker";

import { router, useLocalSearchParams } from "expo-router";
import { useAtomValue } from "jotai";
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
import { useInsertReview } from "@/api/reactQuery/review/useInsertReview";
import { userAtom } from "@/atoms/userAtom";
import RatingSelector from "@/components/atoms/RatingSelector";
import CustomSafeAreaView from "@/components/CustomSafeAriaView";
import { getGlobalHandleToast } from "@/components/CustomToast";
import CoursePreviewCard from "@/components/card/CoursePreviewCard";
import HeaderBar from "@/components/HeaderBar";
import GuideSection from "@/components/molecules/GuideSection";
import ImagePickerGroup from "@/components/molecules/ImagePickerGroup";
import TextareaField from "@/components/molecules/TextareaField";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useUploadImages } from "@/hooks/useUploadImages";

export default function ReviewWriteScreen() {
  const { courseId } = useLocalSearchParams();

  const userInfo = useAtomValue(userAtom);

  const { data } = useFindCourse(Number(courseId));

  const { image_url = "", start_name = "", end_name = "" } = data || {};

  const [rate, setRate] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewImages, setReviewImages] = useState<
    ImagePicker.ImagePickerAsset[]
  >([]);

  const { handleUploadImages } = useUploadImages();
  const { mutateAsync: insertReview } = useInsertReview();

  const handleReviewSubmit = async () => {
    const { uploadedUrls } = await handleUploadImages(reviewImages);

    try {
      const reviewId = await insertReview({
        userId: userInfo.id,
        courseId: Number(courseId),
        rate,
        content: reviewText,
        images: uploadedUrls,
      });

      if (reviewId) {
        router.back();
        getGlobalHandleToast("리뷰 등록이 완료되었습니다.");
      }
    } catch (error) {
      if ((error as PostgrestError).code === "23505") {
        getGlobalHandleToast("이미 작성하신 리뷰이므로 등록할 수 없습니다.");
      } else {
        getGlobalHandleToast("리뷰 등록에 실패했습니다.");
      }
    }
  };

  return (
    <CustomSafeAreaView>
      <HeaderBar isShowBackButton={true} title={"리뷰 작성"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView className="flex-1">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <VStack className="h-full flex-1 gap-6 px-6 pt-6">
              {/* NOTE: 산책 코스 정보 표시 */}
              <CoursePreviewCard
                endName={end_name}
                imageUrl={image_url}
                startName={start_name}
              />
              {/* NOTE: 별점 선택 */}
              <VStack className="items-center gap-2">
                <Text className="font-semibold text-lg">
                  이 산책 코스는 어떠셨나요?
                </Text>
                <Text className="text-slate-500 text-sm">
                  별점을 선택해주세요
                </Text>
                <RatingSelector rate={rate} setRate={setRate} />
              </VStack>
              {/* NOTE: 리뷰 작성 */}
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
              {/* NOTE: 사진 등록 */}
              <VStack className="gap-2">
                <Text className="font-medium">사진 추가 (선택사항)</Text>
                <Text className="mb-2 text-slate-500 text-sm">
                  산책 코스의 사진을 올려주세요 (최대 3장)
                </Text>
                <ImagePickerGroup
                  images={reviewImages}
                  maxLength={3}
                  setImages={setReviewImages}
                />
              </VStack>
              {/* NOTE: 리뷰 안내 */}
              <GuideSection
                guideText={[
                  "실제 경험을 바탕으로 솔직하게 작성해주세요",
                  "산책로의 상태, 편의시설, 접근성 등을 포함해주세요",
                  "다른 반려견 주인들에게 도움이 되는 정보를 공유해주세요",
                  "부적절한 내용은 삭제될 수 있습니다",
                ]}
                title={"리뷰 작성 가이드"}
              />
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
          <ButtonText>리뷰 등록하기</ButtonText>
        </Button>
      </View>
    </CustomSafeAreaView>
  );
}
