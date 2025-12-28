import { router } from "expo-router";
import { useAtomValue } from "jotai";
import {
  ChevronLeft,
  EllipsisVertical,
  Heart,
  Share2,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { useDeleteLikedCourse } from "@/api/reactQuery/like/useDeleteLikedCourse";
import { useFindLikedCourse } from "@/api/reactQuery/like/useFindLikedCourse";
import { useInsertLikedCourse } from "@/api/reactQuery/like/useInsertLikedCourse";
import { userAtom } from "@/atoms/userAtom";
import { useThemeColor } from "@/hooks/useThemeColor";
import BlockCourseActionsheet from "../actionsheet/BlockCourseActionsheet";
import OptionsActionsheet from "../actionsheet/OptionsActionsheet";
import { getGlobalHandleToast } from "../CustomToast";
import { Button } from "../ui/button";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";

interface DetailHeaderBarProps {
  courseId: number;
}

export default function DetailHeaderBar({ courseId }: DetailHeaderBarProps) {
  const userInfo = useAtomValue(userAtom);

  const error500Color = useThemeColor({}, "--color-error-500");

  const { data: likeData } = useFindLikedCourse({
    userId: userInfo.id,
    courseId,
  });

  const { id } = likeData || {};

  const { mutateAsync: insertLikeCourse } = useInsertLikedCourse();
  const { mutateAsync: deleteLikeCourse } = useDeleteLikedCourse();

  const [showOptionsActionsheet, setShowOptionsActionsheet] = useState(false);
  const [showBlockCourseActionsheet, setShowBlockCourseActionsheet] =
    useState(false);
  const [isLikeCourse, setIsLikeCourse] = useState(!!id);

  useEffect(() => {
    setIsLikeCourse(!!id);
  }, [id]);

  const handleLike = async () => {
    try {
      if (!isLikeCourse) {
        await insertLikeCourse({ userId: userInfo.id, courseId });
        setIsLikeCourse(true);
        getGlobalHandleToast("산책 코스를 찜했습니다❤️");
      } else {
        await deleteLikeCourse({ userId: userInfo.id, courseId });
        setIsLikeCourse(false);
        getGlobalHandleToast("찜 목록에서 뺐습니다");
      }
    } catch {
      getGlobalHandleToast("좋아요 처리에 실패했습니다.");
    }
  };

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
          onPress={handleLike}
          variant={"outline"}
        >
          <Icon
            as={Heart}
            className={'"h-5 w-5 text-error-500'}
            fill={isLikeCourse ? `rgb(${error500Color})` : "transparent"}
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
        onPressOption={() => {
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
