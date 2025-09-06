/**
 * 난이도 선택 화면
 * 3개 난이도 중 하나 이상 선택
 */

import type { DifficultyLevel } from "@/types";

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
  difficulties,
  difficultyColors,
  layout,
  neutralColors,
  spacing,
  typography,
} from "@/constants/designSystem";
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
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>난이도 선택</Text>
        <TouchableOpacity
          onPress={toggleAllDifficulties}
          style={styles.selectAllButton}
        >
          <Text style={styles.selectAllText}>
            {allSelected ? "전체해제" : "전체선택"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 난이도 목록 */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.difficultyList}>
          {difficulties.map((difficulty) => {
            const isSelected = selectedDifficulties.includes(difficulty.id);
            const difficultyColor = difficultyColors[difficulty.id];

            return (
              <TouchableOpacity
                activeOpacity={0.7}
                key={difficulty.id}
                onPress={() => toggleDifficulty(difficulty.id)}
                style={[
                  styles.difficultyItem,
                  isSelected && [
                    styles.difficultyItemSelected,
                    { borderColor: difficultyColor },
                  ],
                ]}
              >
                <View style={styles.difficultyContent}>
                  <View style={styles.difficultyHeader}>
                    <View
                      style={[
                        styles.difficultyBadge,
                        { backgroundColor: `${difficultyColor}20` },
                      ]}
                    >
                      <Text
                        style={[
                          styles.difficultyName,
                          { color: difficultyColor },
                        ]}
                      >
                        {difficulty.name}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.difficultyDescription}>
                    {difficulty.description}
                  </Text>
                </View>

                {/* 체크박스 */}
                <View
                  style={[
                    styles.checkbox,
                    isSelected && [
                      styles.checkboxSelected,
                      { backgroundColor: difficultyColor },
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
          {selectedDifficulties.length}개 난이도 선택됨
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleNext}
          style={[
            styles.nextButton,
            selectedDifficulties.length === 0 && styles.nextButtonDisabled,
          ]}
        >
          <Text
            style={[
              styles.nextButtonText,
              selectedDifficulties.length === 0 &&
                styles.nextButtonTextDisabled,
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
  difficultyList: {
    padding: layout.screenPadding,
    gap: spacing.md,
  },
  difficultyItem: {
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
  difficultyItemSelected: {
    backgroundColor: neutralColors[50],
  },
  difficultyContent: {
    flex: 1,
  },
  difficultyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 12,
  },
  difficultyName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
  },
  difficultyDescription: {
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
