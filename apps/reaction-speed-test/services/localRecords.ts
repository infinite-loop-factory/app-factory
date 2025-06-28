import AsyncStorage from "@react-native-async-storage/async-storage";

export interface LocalRecord {
  id: string;
  created_at: string;
  result_value: number;
  unit: string;
}

const LOCAL_RECORDS_KEY = "reaction_speed_local_records";

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const insertLocalRecord = async (
  result_value: number,
): Promise<LocalRecord> => {
  try {
    const newRecord: LocalRecord = {
      id: generateId(),
      created_at: new Date().toISOString(),
      result_value,
      unit: "ms",
    };

    const existingRecords = await getLocalRecords();
    const updatedRecords = [newRecord, ...existingRecords];

    await AsyncStorage.setItem(
      LOCAL_RECORDS_KEY,
      JSON.stringify(updatedRecords),
    );

    return newRecord;
  } catch (error) {
    console.error("Failed to save local record:", error);
    throw error;
  }
};

export const getLocalRecords = async (): Promise<LocalRecord[]> => {
  try {
    const storedRecords = await AsyncStorage.getItem(LOCAL_RECORDS_KEY);

    if (!storedRecords) {
      return [];
    }

    const records: LocalRecord[] = JSON.parse(storedRecords);

    return records.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  } catch (error) {
    console.error("Failed to get local records:", error);
    return [];
  }
};

export const deleteLocalRecord = async (recordId: string): Promise<void> => {
  try {
    const existingRecords = await getLocalRecords();
    const filteredRecords = existingRecords.filter(
      (record) => record.id !== recordId,
    );

    await AsyncStorage.setItem(
      LOCAL_RECORDS_KEY,
      JSON.stringify(filteredRecords),
    );
  } catch (error) {
    console.error("Failed to delete local record:", error);
    throw error;
  }
};

export const clearLocalRecords = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(LOCAL_RECORDS_KEY);
  } catch (error) {
    console.error("Failed to clear local records:", error);
    throw error;
  }
};

export const getLocalRecordsCount = async (): Promise<number> => {
  try {
    const records = await getLocalRecords();
    return records.length;
  } catch (error) {
    console.error("Failed to get local records count:", error);
    return 0;
  }
};
