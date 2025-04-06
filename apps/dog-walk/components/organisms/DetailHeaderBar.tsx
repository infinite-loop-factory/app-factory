import { tva } from "@gluestack-ui/nativewind-utils/tva";
import { router } from "expo-router";
import { ChevronLeft, Heart, Share2 } from "lucide-react-native";
import { getGlobalHandleToast } from "../CustomToast";
import { Button } from "../ui/button";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";

interface IDetailHeaderBar {
  isFavorite: boolean;
  setIsFavorite: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DetailHeaderBar({
  isFavorite,
  setIsFavorite,
}: IDetailHeaderBar) {
  const HeartIconStyle = tva({
    variants: {
      variant: {
        default: "h-5 w-5 text-red-500",
        isFavorite: "h-5 w-5 text-red-500 fill-red-500",
      },
    },
  });

  return (
    <HStack className="w-full items-center justify-between px-4 py-3">
      <Button
        variant={"outline"}
        action={"default"}
        className="w-6 rounded-full border-white"
        onPress={() => {
          router.back();
        }}
      >
        <Icon as={ChevronLeft} className="h-6 w-6 text-slate-800" />
      </Button>
      <HStack className="gap-2">
        <Button
          variant={"outline"}
          action={"default"}
          className="w-5 rounded-full border-white"
          onPress={() => setIsFavorite((prev) => !prev)}
        >
          <Icon
            as={Heart}
            className={HeartIconStyle({
              variant: isFavorite ? "isFavorite" : "default",
            })}
          />
        </Button>
        <Button
          variant={"outline"}
          action={"default"}
          className="w-5 rounded-full border-white"
          onPress={() => {
            getGlobalHandleToast("해당 기능은 준비 중입니다.");
          }}
        >
          <Icon as={Share2} className="h-5 w-5 text-slate-800" />
        </Button>
      </HStack>
    </HStack>
  );
}
