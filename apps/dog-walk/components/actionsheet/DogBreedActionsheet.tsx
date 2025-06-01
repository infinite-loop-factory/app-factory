import { dogBreeds } from "@/constants/DogBreeds";
import type { Option } from "@/types/option";
import { View } from "react-native";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetFlatList,
  ActionsheetItem,
  ActionsheetItemText,
} from "../ui/actionsheet";
import { Text } from "../ui/text";

interface IDogBreedActionsheetProps {
  showActionsheet: boolean;
  setShowActionsheet: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedBreed: React.Dispatch<
    React.SetStateAction<{
      name: string;
      dogBreed: string;
      gender: string;
      birth: Date;
    }>
  >;
}

export default function DogBreedActionsheet({
  showActionsheet,
  setShowActionsheet,
  setSelectedBreed,
}: IDogBreedActionsheetProps) {
  const handleClose = () => {
    setShowActionsheet(false);
  };

  const onPressItem = (label: string) => {
    setSelectedBreed((prev) => ({
      ...prev,
      dogBreed: label,
    }));
    setShowActionsheet(false);
  };

  const DogBreedItem = ({ label }: Option) => {
    return (
      <ActionsheetItem onPress={() => onPressItem(label)}>
        <ActionsheetItemText>{label}</ActionsheetItemText>
      </ActionsheetItem>
    );
  };

  return (
    <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent className="max-h-96">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <View className="w-full border-neutral-200 border-b p-3">
          <Text size="lg" className="font-semibold">
            견종 선택
          </Text>
        </View>
        <ActionsheetFlatList
          data={dogBreeds}
          keyExtractor={(item: Option) => item.value}
          renderItem={({ item }: { item: Option }) => (
            <DogBreedItem label={item.label} value={item.value} />
          )}
        />
      </ActionsheetContent>
    </Actionsheet>
  );
}
