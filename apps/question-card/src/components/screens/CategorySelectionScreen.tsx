/**
 * 카테고리 선택 화면
 * 6개 카테고리 중 하나 이상 선택
 */

import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// getCategoryColor import removed as it's no longer used
import { useAppActions, useAppState } from "@/context/AppContext";

export default function CategorySelectionScreen() {
  const router = useRouter();
  const { categories, selection } = useAppState();
  const { selectCategories } = useAppActions();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    selection.selectedCategories,
  );

  // 전체 선택/해제 토글
  const toggleAllCategories = () => {
    if (selectedCategories.length === categories.length) {
      // 모두 선택된 경우 - 모두 해제
      setSelectedCategories([]);
    } else {
      // 일부만 선택되거나 아무것도 선택되지 않은 경우 - 모두 선택
      setSelectedCategories(categories.map((cat) => cat.id));
    }
  };

  // 개별 카테고리 토글
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  // 다음 단계로 이동
  const handleNext = () => {
    if (selectedCategories.length === 0) {
      Alert.alert(
        "카테고리를 선택해 주세요",
        "적어도 하나 이상의 카테고리를 선택해야 합니다.",
        [{ text: "확인" }],
      );
      return;
    }

    // 선택 상태 저장 후 다음 화면으로 이동
    selectCategories(selectedCategories);
    router.push("/difficulty-selection");
  };

  const allSelected = selectedCategories.length === categories.length;

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      {/* 헤더 */}
      <View className="flex-row items-center justify-between border-gray-200 border-b bg-white px-5 py-4">
        <Text className="font-semibold text-gray-900 text-xl">
          카테고리 선택
        </Text>
        <TouchableOpacity
          className="rounded-lg bg-gray-100 px-4 py-2"
          onPress={toggleAllCategories}
        >
          <Text className="font-medium text-gray-700 text-sm">
            {allSelected ? "전체해제" : "전체선택"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 카테고리 목록 */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="gap-4 p-5">
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category.id);

            return (
              <TouchableOpacity
                activeOpacity={0.7}
                className={`flex-row items-center rounded-xl border-2 bg-white p-5 shadow-sm ${
                  isSelected
                    ? "border-orange-200 bg-orange-50"
                    : "border-gray-200"
                }`}
                key={category.id}
                onPress={() => toggleCategory(category.id)}
              >
                <View className="flex-1">
                  <View className="mb-2 flex-row items-center">
                    <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                      <Text className="text-lg">{category.icon}</Text>
                    </View>
                    <Text
                      className={`font-medium text-lg ${
                        isSelected ? "text-orange-600" : "text-gray-900"
                      }`}
                    >
                      {category.name}
                    </Text>
                  </View>

                  <Text className="text-gray-600 text-sm leading-5">
                    {category.description}
                  </Text>
                </View>

                {/* 체크박스 */}
                <View
                  className={`ml-4 h-6 w-6 items-center justify-center rounded border-2 ${
                    isSelected
                      ? "border-orange-500 bg-orange-500"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {isSelected && (
                    <Text className="font-bold text-sm text-white">✓</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* 선택 요약 및 다음 버튼 */}
      <View className="border-gray-200 border-t bg-white p-5">
        <View className="mb-3 items-center">
          <Text className="mb-1 text-gray-600 text-sm">선택된 카테고리</Text>
          <View className="flex-row items-end">
            <Text className="font-bold text-3xl text-gray-900">
              {selectedCategories.length}
            </Text>
            <Text className="mb-1 ml-1 font-medium text-gray-400 text-lg">
              개
            </Text>
          </View>
          <View className="mt-2 h-1 w-12 rounded-full bg-orange-500 opacity-60" />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          className={`h-12 items-center justify-center rounded-lg ${
            selectedCategories.length === 0 ? "bg-gray-300" : "bg-orange-500"
          }`}
          onPress={handleNext}
        >
          <Text
            className={`font-medium text-base ${
              selectedCategories.length === 0 ? "text-gray-500" : "text-white"
            }`}
          >
            다음 단계
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
