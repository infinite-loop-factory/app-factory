interface RecordData {
  result_value: number;
}

export const useRecordStatistics = <T extends RecordData>(records: T[]) => {
  const bestTime =
    records.length > 0 ? Math.min(...records.map((r) => r.result_value)) : 0;

  const averageTime =
    records.length > 0
      ? Math.round(
          records.reduce((sum, r) => sum + r.result_value, 0) / records.length,
        )
      : 0;

  return {
    bestTime,
    averageTime,
    recordCount: records.length,
  };
};
