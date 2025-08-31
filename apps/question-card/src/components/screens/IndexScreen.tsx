/**
 * EasyTalking 앱의 시작 화면
 * 카테고리 선택 화면으로 자동 이동하는 스플래시 화면
 */

import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppState } from "@/context/AppContext";
import {
  neutralColors,
  spacing,
  typography,
} from "../../constants/designSystem";

export default function IndexScreen() {
  const router = useRouter();
  const { isInitialized, isLoading, error } = useAppState();

  useEffect(() => {
    // 앱이 초기화되면 카테고리 선택 화면으로 이동
    if (isInitialized && !isLoading && !error) {
      const timer = setTimeout(() => {
        router.replace("/category-selection");
      }, 1500); // 1.5초 후 자동 이동

      return () => clearTimeout(timer);
    }
  }, [isInitialized, isLoading, error, router]);

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>앱 실행 오류</Text>
          <Text style={styles.errorMessage}>{error.message}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* 앱 로고/타이틀 */}
        <Text style={styles.logo}>🌱</Text>
        <Text style={styles.title}>이지토킹</Text>
        <Text style={styles.subtitle}>EasyTalking</Text>

        {/* 설명 */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            자기탐구와 의미있는 대화를 위한
          </Text>
          <Text style={styles.description}>디지털 질문카드</Text>
        </View>

        {/* 로딩 표시 */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>로딩 중...</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  logo: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.bold,
    color: neutralColors[800],
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: neutralColors[500],
    marginBottom: spacing.xl,
    textAlign: "center",
  },
  descriptionContainer: {
    alignItems: "center",
    marginBottom: spacing["2xl"],
  },
  description: {
    fontSize: typography.fontSize.base,
    color: neutralColors[600],
    textAlign: "center",
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
  },
  loadingContainer: {
    marginTop: spacing.xl,
  },
  loadingText: {
    fontSize: typography.fontSize.sm,
    color: neutralColors[500],
    textAlign: "center",
  },
  errorContainer: {
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  errorTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: "#ef4444",
    marginBottom: spacing.md,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: typography.fontSize.base,
    color: neutralColors[600],
    textAlign: "center",
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
  },
});
