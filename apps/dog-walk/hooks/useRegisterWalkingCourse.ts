import type * as ImagePicker from "expo-image-picker";

import { decode } from "base64-arraybuffer";
import { router } from "expo-router";
import { useInsertCourse } from "@/api/reactQuery/course/useInsertCourse";
import { supabase } from "@/api/supabaseClient";
import { getGlobalHandleToast } from "@/components/CustomToast";
import usePedestrianRoutes from "./usePedestrianRoutes";

export function useRegisterWalkingCourse() {
  const { mutateAsync: insertCourse } = useInsertCourse();
  const { getRoutes } = usePedestrianRoutes();

  const handleRegister = async ({
    userId,
    courseImage,
    visitedDate,
    start,
    end,
    recommendReason,
  }: {
    userId: string;
    courseImage: ImagePicker.ImagePickerAsset[];
    visitedDate: Date;
    start: {
      name: string;
      lat: number;
      lng: number;
    };
    end: {
      name: string;
      lat: number;
      lng: number;
    };
    recommendReason: string;
  }) => {
    let uploadUrl = "";

    const image = courseImage[0];

    if (!image) return;

    const fileExt = image.uri.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `private/${fileName}`;

    if (!image.base64) {
      getGlobalHandleToast("이미지를 처리할 수 없습니다.");
      return;
    }

    const fileData = decode(image.base64);

    const { error } = await supabase.storage
      .from("dog-walk-images")
      .upload(filePath, fileData, {
        contentType: image.mimeType,
        upsert: true,
      });

    if (error) {
      getGlobalHandleToast("이미지 업로드에 실패했습니다.");
      return;
    }

    try {
      const { data } = supabase.storage
        .from("dog-walk-images")
        .getPublicUrl(filePath);

      uploadUrl = data.publicUrl;
    } catch (_error) {
      getGlobalHandleToast("업로드된 이미지 조회에 실패했습니다.");
      return;
    }

    try {
      const { pathCoords, totalDistance, totalTime } = await getRoutes({
        start: {
          latitude: start.lat,
          longitude: start.lng,
        },
        end: {
          latitude: end.lat,
          longitude: end.lng,
        },
      });

      try {
        const id = await insertCourse({
          userId,
          visitedDate,
          startName: start.name,
          startLat: start.lat,
          startLng: start.lng,
          endName: end.name,
          endLat: end.lat,
          endLng: end.lng,
          imageUrl: uploadUrl,
          recommendReason,
          totalDistance,
          totalTime,
          pathCoords,
        });

        getGlobalHandleToast("산책 코스 등록이 완료되었습니다.");

        router.push({
          pathname: "/(screens)/detail/[id]",
          params: {
            id,
          },
        });
      } catch (_error) {
        getGlobalHandleToast("산책 코스 등록에 실패했습니다.");
      }
    } catch (_error) {
      getGlobalHandleToast("경로 조회에 실패했습니다.");
      return;
    }
  };

  return {
    handleRegister,
  };
}
