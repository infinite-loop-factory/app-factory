/**
 * 난이도 선택 화면
 * 3개 난이도 중 하나 이상 선택
 */

import type { DifficultyLevel } from "@/types";

import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FloatingActionButton,
  FloatingBackButton,
  OrangeHeader,
} from "@/components/ui";
import { difficulties } from "@/constants/designSystem";
import { useAppActions, useAppState } from "@/context/AppContext";

export default function DifficultySelectionScreen() {
  const router = useRouter();
  const { selection } = useAppState();
  const { selectDifficulties } = useAppActions();

  const [selectedDifficulties, setSelectedDifficulties] = useState<
    DifficultyLevel[]
  >(selection.selectedDifficulties);

  // 전체 선택/해제 토글
  const toggleAllDifficulties = () => {
    if (selectedDifficulties.length === difficulties.length) {
      // 모두 선택된 경우 - 모두 해제
      setSelectedDifficulties([]);
    } else {
      // 일부만 선택되거나 아무것도 선택되지 않은 경우 - 모두 선택
      setSelectedDifficulties(difficulties.map((diff) => diff.id));
    }
  };

  // 개별 난이도 토글
  const toggleDifficulty = (difficultyId: DifficultyLevel) => {
    setSelectedDifficulties((prev) => {
      if (prev.includes(difficultyId)) {
        return prev.filter((id) => id !== difficultyId);
      }
      return [...prev, difficultyId];
    });
  };

  // 다음 단계로 이동
  const handleNext = () => {
    if (selectedDifficulties.length === 0) {
      Alert.alert(
        "난이도를 선택해 주세요",
        "적어도 하나 이상의 난이도를 선택해야 합니다.",
        [{ text: "확인" }],
      );
      return;
    }

    // 선택 상태 저장 후 다음 화면으로 이동
    selectDifficulties(selectedDifficulties);
    router.push("/question-main");
  };

  const allSelected = selectedDifficulties.length === difficulties.length;

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      {/* 플로팅 뒤로 버튼 */}
      <FloatingBackButton onPress={() => router.push("/category-selection")} />

      {/* 오렌지 톤 헤더 */}
      <OrangeHeader title="난이도 선택" />

      {/* 플로팅 전체선택 FAB */}
      <FloatingActionButton
        icon={allSelected ? "↻" : "✓"}
        label={allSelected ? "해제" : "전체"}
        onPress={toggleAllDifficulties}
        position="bottom-right"
        style="primary"
      />

      {/* 난이도 목록 */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="gap-4 p-5">
          {/* 안내 텍스트 */}
          <View className="mb-4">
            <Text className="text-center text-gray-600 text-sm">
              원하는 난이도를 선택하세요
            </Text>
          </View>
          {difficulties.map((difficulty) => {
            const isSelected = selectedDifficulties.includes(difficulty.id);

            // Modern Refined: 난이도별 오렌지 포인트 색상
            const getDifficultyStyle = () => {
              switch (difficulty.id) {
                case "easy":
                  return "border-green-200 bg-green-50 text-green-700";
                case "medium":
                  return "border-yellow-200 bg-yellow-50 text-yellow-700";
                case "hard":
                  return "border-red-200 bg-red-50 text-red-700";
                default:
                  return "border-gray-200 bg-gray-50 text-gray-700";
              }
            };

            const getCheckboxStyle = () => {
              switch (difficulty.id) {
                case "easy":
                  return "border-green-500 bg-green-500";
                case "medium":
                  return "border-yellow-500 bg-yellow-500";
                case "hard":
                  return "border-red-500 bg-red-500";
                default:
                  return "border-gray-500 bg-gray-500";
              }
            };

            return (
              <TouchableOpacity
                activeOpacity={0.7}
                className={`flex-row items-center rounded-xl border-2 bg-white p-5 shadow-sm ${
                  isSelected
                    ? "border-orange-200 bg-orange-50"
                    : "border-gray-200"
                }`}
                key={difficulty.id}
                onPress={() => toggleDifficulty(difficulty.id)}
              >
                <View className="flex-1">
                  <View className="mb-3 flex-row items-center">
                    <View
                      className={`rounded-full px-3 py-1.5 ${getDifficultyStyle()}`}
                    >
                      <Text
                        className={`font-medium text-sm ${getDifficultyStyle().split(" ")[2]}`}
                      >
                        {difficulty.name}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-gray-600 text-sm leading-5">
                    {difficulty.description}
                  </Text>
                </View>

                {/* 체크박스 */}
                <View
                  className={`ml-4 h-6 w-6 items-center justify-center rounded border-2 ${
                    isSelected ? getCheckboxStyle() : "border-gray-300 bg-white"
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
          <Text className="mb-1 text-gray-600 text-sm">선택된 난이도</Text>
          <View className="flex-row items-end">
            <Text className="font-bold text-3xl text-gray-900">
              {selectedDifficulties.length}
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
            selectedDifficulties.length === 0 ? "bg-gray-300" : "bg-orange-500"
          }`}
          onPress={handleNext}
        >
          <Text
            className={`font-medium text-base ${
              selectedDifficulties.length === 0 ? "text-gray-500" : "text-white"
            }`}
          >
            다음 단계
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
