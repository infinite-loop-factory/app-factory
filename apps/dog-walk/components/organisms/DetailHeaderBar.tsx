import { tva } from "@gluestack-ui/nativewind-utils/tva";
import { router } from "expo-router";
import {
  ChevronLeft,
  EllipsisVertical,
  Heart,
  Share2,
} from "lucide-react-native";
import { useState } from "react";
import BlockCourseActionsheet from "../actionsheet/BlockCourseActionsheet";
import OptionsActionsheet from "../actionsheet/OptionsActionsheet";
import { getGlobalHandleToast } from "../CustomToast";
import { Button } from "../ui/button";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";

interface IDetailHeaderBar {
  courseId: number;
  isFavorite: boolean;
  setIsFavorite: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DetailHeaderBar({
  courseId,
  isFavorite,
  setIsFavorite,
}: IDetailHeaderBar) {
  const [showOptionsActionsheet, setShowOptionsActionsheet] = useState(false);
  const [showBlockCourseActionsheet, setShowBlockCourseActionsheet] =
    useState(false);

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
        action={"default"}
        className="w-6 rounded-full border-white"
        onPress={() => {
          router.back();
        }}
        variant={"outline"}
      >
        <Icon as={ChevronLeft} className="h-6 w-6 text-slate-800" />
      </Button>
      <HStack className="gap-1">
        <Button
          action={"default"}
          className="w-1 rounded-full border-white"
          onPress={() => setIsFavorite((prev) => !prev)}
          variant={"outline"}
        >
          <Icon
            as={Heart}
            className={HeartIconStyle({
              variant: isFavorite ? "isFavorite" : "default",
            })}
          />
        </Button>
        <Button
          action={"default"}
          className="w-1 rounded-full border-white"
          onPress={() => {
            getGlobalHandleToast("해당 기능은 준비 중입니다.");
          }}
          variant={"outline"}
        >
          <Icon as={Share2} className="h-5 w-5 text-slate-800" />
        </Button>
        <Button
          action={"default"}
          className="w-1 rounded-full border-white"
          onPress={() => {
            setShowOptionsActionsheet(true);
          }}
          variant={"outline"}
        >
          <Icon as={EllipsisVertical} className="h-5 w-5 text-slate-800" />
        </Button>
      </HStack>
      {/* NOTE: MODAL ==> */}
      <OptionsActionsheet
        onPressBlock={() => {
          setShowOptionsActionsheet(false);
          setShowBlockCourseActionsheet(true);
        }}
        setShowActionsheet={setShowOptionsActionsheet}
        showActionsheet={showOptionsActionsheet}
      />
      <BlockCourseActionsheet
        courseId={courseId}
        setShowActionsheet={setShowBlockCourseActionsheet}
        showActionsheet={showBlockCourseActionsheet}
      />
      {/* NOTE: <== MODAL */}
    </HStack>
  );
}
