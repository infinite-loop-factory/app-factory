import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTO_LOGIN_KEY = "autoLogin";

export const getAutoLoginSetting = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(AUTO_LOGIN_KEY);
    return value === "true";
  } catch (error) {
    console.error("Error getting auto login setting:", error);
    return false;
  }
};

export const setAutoLoginSetting = async (enabled: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(AUTO_LOGIN_KEY, enabled.toString());
  } catch (error) {
    console.error("Error setting auto login setting:", error);
  }
};

export const clearAutoLoginSetting = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTO_LOGIN_KEY);
  } catch (error) {
    console.error("Error clearing auto login setting:", error);
  }
};
