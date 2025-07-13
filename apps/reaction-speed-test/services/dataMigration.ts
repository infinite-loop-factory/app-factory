import { clearLocalRecords, getLocalRecords } from "@/services/localRecords";
import { insertRecord } from "@/services/records";

export interface MigrationResult {
  totalRecords: number;
  migratedRecords: number;
  failedRecords: number;
  errors: string[];
}

export const migrateLocalDataToCloud = async (): Promise<MigrationResult> => {
  try {
    const localRecords = await getLocalRecords();

    if (localRecords.length === 0) {
      return {
        totalRecords: 0,
        migratedRecords: 0,
        failedRecords: 0,
        errors: [],
      };
    }

    const errors: string[] = [];
    let migratedCount = 0;

    // 시간순으로 정렬하여 순차적으로 업로드
    const sortedRecords = localRecords.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

    for (const record of sortedRecords) {
      try {
        await insertRecord(record.result_value);
        migratedCount++;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        errors.push(`Failed to migrate record ${record.id}: ${errorMessage}`);
      }
    }

    const result: MigrationResult = {
      totalRecords: localRecords.length,
      migratedRecords: migratedCount,
      failedRecords: localRecords.length - migratedCount,
      errors,
    };

    // 성공적으로 마이그레이션된 경우에만 로컬 데이터 삭제
    if (result.migratedRecords > 0 && result.failedRecords === 0) {
      await clearLocalRecords();
    }

    return result;
  } catch (error) {
    throw new Error(
      `Migration failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};
