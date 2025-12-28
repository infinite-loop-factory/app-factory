import type { Option } from "@/types/option";

import { View } from "react-native";
import { dogBreeds } from "@/constants/DogBreeds";
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
  dogBreed: string;
  setShowActionsheet: React.Dispatch<React.SetStateAction<boolean>>;
  setDogBreed: React.Dispatch<React.SetStateAction<string>>;
}

export default function DogBreedActionsheet({
  showActionsheet,
  dogBreed,
  setShowActionsheet,
  setDogBreed,
}: IDogBreedActionsheetProps) {
  const handleClose = () => {
    setShowActionsheet(false);
  };

  const onPressItem = (label: string) => {
    setDogBreed(label);
    setShowActionsheet(false);
  };

  const DogBreedItem = ({
    label,
    isFocused,
  }: {
    label: string;
    isFocused: boolean;
  }) => {
    return (
      <ActionsheetItem isFocused={isFocused} onPress={() => onPressItem(label)}>
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
          <Text className="font-semibold" size="lg">
            견종 선택
          </Text>
        </View>
        <ActionsheetFlatList
          data={dogBreeds as Option[]}
          keyExtractor={(item) => (item as Option).value}
          renderItem={({ item }) => (
            <DogBreedItem
              isFocused={dogBreed === (item as Option).label}
              label={(item as Option).label}
            />
          )}
        />
      </ActionsheetContent>
    </Actionsheet>
  );
}
