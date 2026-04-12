import type { UserSettings, VisitHistory } from "@/types";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "@/constants/config";

/**
 * 사용자 설정 조회
 */
export async function getUserSettings(): Promise<UserSettings | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
    if (!data) return null;
    return JSON.parse(data) as UserSettings;
  } catch (error) {
    console.error("Failed to get user settings:", error);
    return null;
  }
}

/**
 * 사용자 설정 저장
 */
export async function saveUserSettings(settings: UserSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_SETTINGS,
      JSON.stringify(settings),
    );
  } catch (error) {
    console.error("Failed to save user settings:", error);
    throw error;
  }
}

/**
 * 방문 히스토리 조회 (v2용)
 */
export async function getVisitHistory(): Promise<VisitHistory[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.VISIT_HISTORY);
    if (!data) return [];
    return JSON.parse(data) as VisitHistory[];
  } catch (error) {
    console.error("Failed to get visit history:", error);
    return [];
  }
}

/**
 * 방문 히스토리 추가 (v2용)
 */
export async function addVisitHistory(history: VisitHistory): Promise<void> {
  try {
    const currentHistory = await getVisitHistory();
    const updatedHistory = [history, ...currentHistory];
    await AsyncStorage.setItem(
      STORAGE_KEYS.VISIT_HISTORY,
      JSON.stringify(updatedHistory),
    );
  } catch (error) {
    console.error("Failed to add visit history:", error);
    throw error;
  }
}

/**
 * 사용자 설정 삭제
 */
export async function clearUserSettings(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_SETTINGS);
  } catch (error) {
    console.error("Failed to clear user settings:", error);
    throw error;
  }
}
