import { useCallback, useEffect, useState } from "react";
import { Alert, Modal, Text, View } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import {
  type MigrationResult,
  migrateLocalDataToCloud,
} from "@/services/dataMigration";
import { getLocalRecordsCount } from "@/services/localRecords";

interface DataMigrationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onMigrationComplete?: (result: MigrationResult) => void;
}

export const DataMigrationModal = ({
  isVisible,
  onClose,
  onMigrationComplete,
}: DataMigrationModalProps) => {
  const [localRecordsCount, setLocalRecordsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);

  const loadLocalRecordsCount = useCallback(async () => {
    setIsLoading(true);
    try {
      const count = await getLocalRecordsCount();
      setLocalRecordsCount(count);
    } catch (error) {
      console.error("Failed to load local records count:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      loadLocalRecordsCount();
    }
  }, [isVisible, loadLocalRecordsCount]);

  const handleMigrate = async () => {
    setIsMigrating(true);
    try {
      const result = await migrateLocalDataToCloud();

      if (result.failedRecords === 0) {
        Alert.alert(
          "마이그레이션 완료",
          `${result.migratedRecords}개의 기록이 성공적으로 클라우드에 저장되었습니다!`,
          [{ text: "확인", onPress: onClose }],
        );
      } else {
        Alert.alert(
          "마이그레이션 부분 성공",
          `${result.migratedRecords}개 성공, ${result.failedRecords}개 실패했습니다. 실패한 기록은 로컬에 남아있습니다.`,
          [{ text: "확인", onPress: onClose }],
        );
      }

      onMigrationComplete?.(result);
    } catch (error) {
      Alert.alert(
        "마이그레이션 실패",
        "데이터 이전 중 오류가 발생했습니다. 나중에 다시 시도해주세요.",
        [{ text: "확인" }],
      );
      console.error("Migration failed:", error);
    } finally {
      setIsMigrating(false);
    }
  };

  if (localRecordsCount === 0) {
    return null;
  }

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={isVisible}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full max-w-md rounded-xl bg-white p-6 dark:bg-slate-900">
          <View className="mb-6 items-center">
            <Text className="mb-2 text-center font-bold text-slate-900 text-xl dark:text-slate-100">
              🔄 데이터 이전
            </Text>
            <Text className="text-center text-slate-600 dark:text-slate-400">
              {isLoading
                ? "로딩 중..."
                : `${localRecordsCount}개의 로컬 기록을 발견했습니다`}
            </Text>
          </View>

          <View className="mb-6">
            <Text className="mb-4 text-center text-slate-700 dark:text-slate-300">
              로그인 전에 측정한 기록들을 클라우드에 저장하시겠습니까?
            </Text>
            <View className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20">
              <Text className="text-center text-blue-700 text-sm dark:text-blue-300">
                💡 클라우드에 저장하면 다른 기기에서도 확인할 수 있습니다
              </Text>
            </View>
          </View>

          <View className="gap-y-3">
            <Button
              action="primary"
              className="h-12 w-full bg-blue-600 dark:bg-blue-500"
              disabled={isMigrating || isLoading}
              onPress={handleMigrate}
            >
              <ButtonText className="text-white">
                {isMigrating ? "이전 중..." : "클라우드에 저장"}
              </ButtonText>
            </Button>

            <Button
              action="secondary"
              className="h-12 w-full border border-slate-300 dark:border-slate-600"
              disabled={isMigrating}
              onPress={onClose}
            >
              <ButtonText className="text-slate-700 dark:text-slate-300">
                나중에 하기
              </ButtonText>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};
