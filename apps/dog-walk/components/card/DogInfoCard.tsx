import { calculateAge } from "@/utils/date";
import { Image } from "react-native";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type TDogInfoCardProp = {
  imageUrl: string;
  name: string;
  breed: string;
  birthdate: string;
  gender: string;
};

export default function DogInfoCard({
  imageUrl,
  name,
  breed,
  birthdate,
  gender,
}: TDogInfoCardProp) {
  return (
    <HStack className="items-center gap-4 rounded-xl border border-slate-200 p-4">
      <Image src={imageUrl} className="h-14 w-14 rounded-full" />
      <VStack className="flex-1 gap-1">
        <Text className="font-semibold">{name}</Text>
        <HStack className="gap-1">
          <Text>
            {breed} • {calculateAge(birthdate)}살 •{" "}
            {gender === "MALE" ? "남아" : "여아"}
          </Text>
        </HStack>
      </VStack>
    </HStack>
  );
}
