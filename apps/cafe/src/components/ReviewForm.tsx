import type React from "react";

import { Star } from "lucide-react-native";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

interface ReviewFormProps {
  cafeId: string;
  onSubmit: (review: { rating: number; content: string }) => void;
  onCancel: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert(
        "평점을 선택해주세요",
        "리뷰를 작성하려면 평점을 선택해야 합니다.",
      );
      return;
    }

    if (content.trim().length < 10) {
      Alert.alert(
        "리뷰 내용을 입력해주세요",
        "최소 10자 이상의 리뷰 내용을 입력해주세요.",
      );
      return;
    }

    onSubmit({ rating, content });
    setRating(0);
    setContent("");
  };

  return (
    <View className="rounded-lg bg-white p-4">
      <Text className="mb-4 font-bold text-lg">리뷰 작성하기</Text>

      {/* Rating */}
      <View className="mb-4">
        <Text className="mb-2 font-medium">평점</Text>
        <View className="flex-row">
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              className="mr-2"
              key={star}
              onPress={() => setRating(star)}
            >
              <Star
                color="#fbbf24"
                fill={rating >= star ? "#fbbf24" : "transparent"}
                size={24}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Review Content */}
      <View className="mb-4">
        <Text className="mb-2 font-medium">리뷰 내용</Text>
        <TextInput
          className="min-h-[100px] rounded-md border border-gray-300 p-2 text-base"
          multiline
          onChangeText={setContent}
          placeholder="이 카페에 대한 솔직한 리뷰를 작성해주세요. (최소 10자)"
          textAlignVertical="top"
          value={content}
        />
      </View>

      {/* Buttons */}
      <View className="mt-2 flex-row justify-end">
        <TouchableOpacity
          className="mr-2 rounded-md border border-gray-300 px-4 py-2"
          onPress={onCancel}
        >
          <Text>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="rounded-md bg-black px-4 py-2"
          onPress={handleSubmit}
        >
          <Text className="text-white">등록하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
