import { Trash2 } from "lucide-react-native";
import { Alert, Image } from "react-native";
import { calculateAge } from "@/utils/date";
import { Button, ButtonIcon } from "../ui/button";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type TDogInfoCardProp = {
  id: number;
  imageUrl: string;
  name: string;
  breed: string;
  birthdate: string;
  gender: string;
  onDelete: (id: number) => void;
};

export default function DogInfoCard({
  id,
  imageUrl,
  name,
  breed,
  birthdate,
  gender,
  onDelete,
}: TDogInfoCardProp) {
  const handleDelete = () => {
    Alert.alert("반려견 삭제", `${name}을(를) 삭제하시겠어요?`, [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => onDelete(id),
      },
    ]);
  };

  return (
    <HStack className="items-center gap-4 rounded-xl border border-slate-200 p-4">
      <Image className="h-14 w-14 rounded-full" src={imageUrl} />
      <VStack className="flex-1 gap-1">
        <Text className="font-semibold">{name}</Text>
        <HStack className="gap-1">
          <Text>
            {breed} • {calculateAge(birthdate)}살 •{" "}
            {gender === "MALE" ? "남아" : "여아"}
          </Text>
        </HStack>
      </VStack>
      <Button onPress={handleDelete} size="sm" variant="link">
        <ButtonIcon as={Trash2} className="h-5 w-5 text-slate-400" />
      </Button>
    </HStack>
  );
}
