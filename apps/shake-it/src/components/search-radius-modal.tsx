import { MaterialIcons } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";
import { formatSearchRadius } from "@/utils/search-radius";

interface SearchRadiusModalProps {
  visible: boolean;
  selectedRadius: number;
  options: readonly number[];
  onSelect: (radius: number) => void | Promise<void>;
  onClose: () => void;
}

export function SearchRadiusModal({
  visible,
  selectedRadius,
  options,
  onSelect,
  onClose,
}: SearchRadiusModalProps) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View className="flex-1 justify-end bg-black/45 px-4 pb-6">
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className="rounded-[28px] bg-white px-5 pt-5 pb-4">
          <View className="mb-4 flex-row items-center justify-between">
            <View>
              <Text className="font-bold text-[#191F28] text-[20px]">
                검색 반경
              </Text>
              <Text className="mt-1 text-slate-500 text-sm">
                주변 맛집을 찾을 범위를 선택하세요
              </Text>
            </View>
            <Pressable
              accessibilityLabel="검색 반경 선택 닫기"
              className="h-9 w-9 items-center justify-center rounded-full bg-slate-100"
              onPress={onClose}
            >
              <MaterialIcons color="#64748b" name="close" size={20} />
            </Pressable>
          </View>

          <View className="gap-3">
            {options.map((option) => {
              const isSelected = option === selectedRadius;

              return (
                <Pressable
                  accessibilityLabel={`${formatSearchRadius(option)} 반경 선택`}
                  accessibilityRole="button"
                  className="flex-row items-center justify-between rounded-2xl border px-4 py-4"
                  key={option}
                  onPress={() => {
                    void onSelect(option);
                  }}
                  style={{
                    borderColor: isSelected ? "#3366FF" : "#E2E8F0",
                    backgroundColor: isSelected ? "#EFF6FF" : "#FFFFFF",
                  }}
                >
                  <View>
                    <Text
                      className="font-semibold text-base"
                      style={{ color: isSelected ? "#1D4ED8" : "#191F28" }}
                    >
                      {formatSearchRadius(option)}
                    </Text>
                    <Text className="mt-1 text-slate-500 text-sm">
                      반경 {option}m 내 음식점 검색
                    </Text>
                  </View>
                  {isSelected ? (
                    <MaterialIcons
                      color="#3366FF"
                      name="check-circle"
                      size={22}
                    />
                  ) : (
                    <View className="h-[22px] w-[22px] rounded-full border border-slate-300" />
                  )}
                </Pressable>
              );
            })}
          </View>

          <Pressable
            className="mt-4 h-12 items-center justify-center rounded-2xl bg-slate-100"
            onPress={onClose}
          >
            <Text className="font-semibold text-slate-600">취소</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
