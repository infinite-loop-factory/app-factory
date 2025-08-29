/**
 * 카테고리 선택 화면
 * 6개 카테고리 중 하나 이상 선택
 */

import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getCategoryColor,
  layout,
  neutralColors,
  spacing,
  typography,
} from "@/constants/designSystem";
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
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>카테고리 선택</Text>
        <TouchableOpacity
          onPress={toggleAllCategories}
          style={styles.selectAllButton}
        >
          <Text style={styles.selectAllText}>
            {allSelected ? "전체해제" : "전체선택"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 카테고리 목록 */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.categoryList}>
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category.id);
            const categoryColor = getCategoryColor(category.id, 500);

            return (
              <TouchableOpacity
                activeOpacity={0.7}
                key={category.id}
                onPress={() => toggleCategory(category.id)}
                style={[
                  styles.categoryItem,
                  isSelected && [
                    styles.categoryItemSelected,
                    { borderColor: categoryColor },
                  ],
                ]}
              >
                <View style={styles.categoryContent}>
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text
                      style={[
                        styles.categoryName,
                        isSelected && { color: categoryColor },
                      ]}
                    >
                      {category.name}
                    </Text>
                  </View>

                  <Text style={styles.categoryDescription}>
                    {category.description}
                  </Text>
                </View>

                {/* 체크박스 */}
                <View
                  style={[
                    styles.checkbox,
                    isSelected && [
                      styles.checkboxSelected,
                      { backgroundColor: categoryColor },
                    ],
                  ]}
                >
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* 선택 요약 및 다음 버튼 */}
      <View style={styles.footer}>
        <Text style={styles.selectionSummary}>
          {selectedCategories.length}개 카테고리 선택됨
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleNext}
          style={[
            styles.nextButton,
            selectedCategories.length === 0 && styles.nextButtonDisabled,
          ]}
        >
          <Text
            style={[
              styles.nextButtonText,
              selectedCategories.length === 0 && styles.nextButtonTextDisabled,
            ]}
          >
            다음 단계
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: neutralColors[200],
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: neutralColors[800],
  },
  selectAllButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: neutralColors[100],
    borderRadius: 6,
  },
  selectAllText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: neutralColors[700],
  },
  scrollView: {
    flex: 1,
  },
  categoryList: {
    padding: layout.screenPadding,
    gap: spacing.md,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: layout.cardPadding,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: neutralColors[200],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryItemSelected: {
    backgroundColor: neutralColors[50],
  },
  categoryContent: {
    flex: 1,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  categoryIcon: {
    fontSize: layout.iconSize.md,
    marginRight: spacing.sm,
  },
  categoryName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: neutralColors[800],
  },
  categoryDescription: {
    fontSize: typography.fontSize.sm,
    color: neutralColors[600],
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },
  checkbox: {
    width: layout.checkboxSize,
    height: layout.checkboxSize,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: neutralColors[300],
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.md,
  },
  checkboxSelected: {
    borderColor: "transparent",
  },
  checkmark: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: typography.fontWeight.bold,
  },
  footer: {
    padding: layout.screenPadding,
    borderTopWidth: 1,
    borderTopColor: neutralColors[200],
    backgroundColor: "#ffffff",
  },
  selectionSummary: {
    fontSize: typography.fontSize.sm,
    color: neutralColors[600],
    textAlign: "center",
    marginBottom: spacing.md,
  },
  nextButton: {
    height: layout.buttonHeight,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonDisabled: {
    backgroundColor: neutralColors[300],
  },
  nextButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: "#ffffff",
  },
  nextButtonTextDisabled: {
    color: neutralColors[500],
  },
});
