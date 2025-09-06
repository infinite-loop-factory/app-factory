/**
 * 질문 시작 화면
 * 선택한 조건 요약 및 4가지 모드 선택
 */

import type { QuestionMode } from "@/types";

import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  categories,
  difficulties,
  layout,
  neutralColors,
  questionModes,
  spacing,
  typography,
} from "@/constants/designSystem";
import { useAppActions, useAppState } from "@/context/AppContext";

export default function QuestionMainScreen() {
  const router = useRouter();
  const { selection, filteredQuestions } = useAppState();
  const { setQuestionMode, filterQuestions } = useAppActions();
  const [totalQuestions, setTotalQuestions] = useState(0);

  // 컴포넌트 마운트시 질문 필터링 실행
  useEffect(() => {
    filterQuestions();
  }, [filterQuestions]);

  // filteredQuestions가 업데이트되면 총 개수 설정
  useEffect(() => {
    setTotalQuestions(filteredQuestions.totalCount);
  }, [filteredQuestions.totalCount]);

  // 선택된 카테고리 이름 가져오기
  const selectedCategoryNames = selection.selectedCategories.map((id) => {
    const category = categories.find((cat) => cat.id === id);
    return category?.name || "";
  });

  // 선택된 난이도 이름 가져오기
  const selectedDifficultyNames = selection.selectedDifficulties.map((id) => {
    const difficulty = difficulties.find((diff) => diff.id === id);
    return difficulty?.name || "";
  });

  // 모드 선택 핸들러
  const handleModeSelect = (mode: QuestionMode) => {
    setQuestionMode(mode);

    // 모드에 따라 다른 화면으로 이동
    if (mode === 4) {
      // 모드 4: 질문 리스트 화면
      router.push("/question-list");
    } else {
      // 모드 1,2,3: 연속 카드 화면
      router.push("/continuous-card");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>질문 시작</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* 선택 조건 요약 */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>선택한 조건</Text>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>카테고리</Text>
            <Text style={styles.summaryValue}>
              {selectedCategoryNames.join(", ")} (
              {selection.selectedCategories.length}개)
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>난이도</Text>
            <Text style={styles.summaryValue}>
              {selectedDifficultyNames.join(", ")} (
              {selection.selectedDifficulties.length}개)
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>총 질문 개수</Text>
            <Text style={[styles.summaryValue, styles.totalCount]}>
              {totalQuestions}개 질문
            </Text>
          </View>
        </View>

        {/* 모드 선택 */}
        <View style={styles.modeSection}>
          <Text style={styles.sectionTitle}>진행 방식 선택</Text>

          <View style={styles.modeList}>
            {questionModes.map((mode) => (
              <TouchableOpacity
                activeOpacity={0.7}
                key={mode.id}
                onPress={() => handleModeSelect(mode.id)}
                style={styles.modeItem}
              >
                <View style={styles.modeContent}>
                  <View style={styles.modeHeader}>
                    <Text style={styles.modeIcon}>{mode.icon}</Text>
                    <Text style={styles.modeName}>{mode.name}</Text>
                  </View>
                  <Text style={styles.modeDescription}>{mode.description}</Text>
                </View>

                {/* 화살표 아이콘 */}
                <View style={styles.arrowContainer}>
                  <Text style={styles.arrow}>›</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>설정 다시하기</Text>
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
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: neutralColors[200],
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: neutralColors[800],
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  summarySection: {
    padding: layout.screenPadding,
    borderBottomWidth: 1,
    borderBottomColor: neutralColors[100],
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: neutralColors[800],
    marginBottom: spacing.md,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: neutralColors[100],
  },
  summaryLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: neutralColors[600],
  },
  summaryValue: {
    fontSize: typography.fontSize.base,
    color: neutralColors[800],
    textAlign: "right",
    flex: 1,
    marginLeft: spacing.md,
  },
  totalCount: {
    fontWeight: typography.fontWeight.semibold,
    color: "#3b82f6",
  },
  modeSection: {
    padding: layout.screenPadding,
  },
  modeList: {
    gap: spacing.md,
  },
  modeItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: layout.cardPadding,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: neutralColors[200],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  modeContent: {
    flex: 1,
  },
  modeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  modeIcon: {
    fontSize: layout.iconSize.md,
    marginRight: spacing.sm,
  },
  modeName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: neutralColors[800],
  },
  modeDescription: {
    fontSize: typography.fontSize.sm,
    color: neutralColors[600],
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },
  arrowContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.md,
  },
  arrow: {
    fontSize: 18,
    color: neutralColors[400],
    fontWeight: typography.fontWeight.bold,
  },
  footer: {
    padding: layout.screenPadding,
    borderTopWidth: 1,
    borderTopColor: neutralColors[200],
    backgroundColor: "#ffffff",
  },
  backButton: {
    height: layout.buttonHeight,
    backgroundColor: neutralColors[100],
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: neutralColors[700],
  },
});
