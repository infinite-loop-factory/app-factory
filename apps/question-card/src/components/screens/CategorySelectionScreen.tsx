/**
 * 카테고리 선택 화면
 * 12개 카테고리를 2개 그룹으로 나누어 표시
 */

import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FloatingActionButton,
  FloatingBackButton,
} from "@/components/floating";
import { OrangeHeader } from "@/components/layout";
import { Box, Pressable, Text } from "@/components/ui";
import { categoryGroups } from "@/constants/designSystem";
import { useAppActions, useAppState } from "@/context/AppContext";
import { useWarningToast } from "@/hooks/useWarningToast";

export default function CategorySelectionScreen() {
  const router = useRouter();
  const { showWarning } = useWarningToast();
  const { categories, selection } = useAppState();
  const { selectCategories } = useAppActions();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    selection.selectedCategories,
  );

  // 그룹별 카테고리 분류
  const groupedCategories = useMemo(() => {
    return categoryGroups.map((group) => ({
      ...group,
      categories: categories.filter((cat) => cat.groupId === group.id),
    }));
  }, [categories]);

  // 전체 선택/해제 토글
  const toggleAllCategories = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map((cat) => cat.id));
    }
  };

  // 그룹별 전체 선택/해제 토글
  const toggleGroupCategories = (groupId: string) => {
    const groupCategoryIds = categories
      .filter((cat) => cat.groupId === groupId)
      .map((cat) => cat.id);

    const allGroupSelected = groupCategoryIds.every((id) =>
      selectedCategories.includes(id),
    );

    if (allGroupSelected) {
      setSelectedCategories((prev) =>
        prev.filter((id) => !groupCategoryIds.includes(id)),
      );
    } else {
      setSelectedCategories((prev) => [
        ...new Set([...prev, ...groupCategoryIds]),
      ]);
    }
  };

  // 그룹 전체 선택 여부 확인
  const isGroupFullySelected = (groupId: string) => {
    const groupCategoryIds = categories
      .filter((cat) => cat.groupId === groupId)
      .map((cat) => cat.id);
    return groupCategoryIds.every((id) => selectedCategories.includes(id));
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
      showWarning(
        "카테고리를 선택해 주세요",
        "적어도 하나 이상의 카테고리를 선택해야 합니다.",
      );
      return;
    }

    selectCategories(selectedCategories);
    router.push("/difficulty-selection");
  };

  const allSelected = selectedCategories.length === categories.length;

  return (
    <SafeAreaView className="flex-1 bg-orange-50">
      {/* 플로팅 뒤로 버튼 */}
      <FloatingBackButton onPress={() => router.push("/")} />

      {/* 오렌지 톤 헤더 */}
      <OrangeHeader title="카테고리 선택" />

      {/* 플로팅 전체선택 FAB */}
      <FloatingActionButton
        icon={allSelected ? "reset" : "check"}
        label={allSelected ? "해제" : "전체"}
        onPress={toggleAllCategories}
        position="bottom-right"
        style="primary"
      />

      {/* 카테고리 목록 (그룹별) */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Box className="p-5">
          {/* 안내 텍스트 */}
          <Box className="mb-4">
            <Text className="text-center text-gray-600 text-sm">
              관심 있는 카테고리를 선택하세요
            </Text>
          </Box>

          {groupedCategories.map((group, groupIndex) => (
            <Box className={groupIndex > 0 ? "mt-6" : ""} key={group.id}>
              {/* 그룹 헤더 */}
              <Box className="mb-3 flex-row items-center justify-between px-1">
                <Box className="flex-row items-center">
                  <Text className="mr-2 text-xl">{group.icon}</Text>
                  <Text className="font-semibold text-gray-800 text-lg">
                    {group.name}
                  </Text>
                </Box>
                <Pressable
                  accessibilityLabel={`${group.name} ${isGroupFullySelected(group.id) ? "전체 해제" : "전체 선택"}`}
                  accessibilityRole="button"
                  onPress={() => toggleGroupCategories(group.id)}
                >
                  <Text className="font-medium text-orange-500 text-sm">
                    {isGroupFullySelected(group.id) ? "전체 해제" : "전체 선택"}
                  </Text>
                </Pressable>
              </Box>

              {/* 그룹 내 카테고리 목록 */}
              <Box className="gap-3">
                {group.categories.map((category) => {
                  const isSelected = selectedCategories.includes(category.id);

                  return (
                    <Pressable
                      accessibilityLabel={category.name}
                      accessibilityRole="checkbox"
                      accessibilityState={{ selected: isSelected }}
                      className={`flex-row items-center rounded-xl border-2 bg-white p-5 shadow-sm ${
                        isSelected
                          ? "border-orange-200 bg-orange-50"
                          : "border-gray-200"
                      }`}
                      key={category.id}
                      onPress={() => toggleCategory(category.id)}
                    >
                      <Box className="flex-1">
                        <Box className="mb-2 flex-row items-center">
                          <Box className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                            <Text className="text-lg">{category.icon}</Text>
                          </Box>
                          <Text
                            className={`font-medium text-lg ${
                              isSelected ? "text-orange-600" : "text-gray-900"
                            }`}
                          >
                            {category.name}
                          </Text>
                        </Box>

                        <Text className="text-gray-600 text-sm leading-5">
                          {category.description}
                        </Text>
                      </Box>

                      {/* 체크박스 */}
                      <Box
                        className={`ml-4 h-6 w-6 items-center justify-center rounded border-2 ${
                          isSelected
                            ? "border-orange-500 bg-orange-500"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isSelected && (
                          <Text className="font-bold text-sm text-white">
                            ✓
                          </Text>
                        )}
                      </Box>
                    </Pressable>
                  );
                })}
              </Box>
            </Box>
          ))}
        </Box>
      </ScrollView>

      {/* 선택 요약 및 다음 버튼 */}
      <Box className="border-gray-200 border-t bg-white p-5">
        <Box className="mb-3 items-center">
          <Text className="mb-1 text-gray-600 text-sm">선택된 카테고리</Text>
          <Box className="flex-row items-end">
            <Text className="font-bold text-3xl text-gray-900">
              {selectedCategories.length}
            </Text>
            <Text className="mb-1 ml-1 font-medium text-gray-400 text-lg">
              개
            </Text>
          </Box>
          <Box className="mt-2 h-1 w-12 rounded-full bg-orange-500 opacity-60" />
        </Box>

        <Pressable
          accessibilityLabel="다음 단계"
          accessibilityRole="button"
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
        </Pressable>
      </Box>
    </SafeAreaView>
  );
}
