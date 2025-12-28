import type * as ImagePicker from "expo-image-picker";

import { decode } from "base64-arraybuffer";
import { router } from "expo-router";
import { useInsertDog } from "@/api/reactQuery/dogs/useInsertDog";
import { supabase } from "@/api/supabaseClient";
import { getGlobalHandleToast } from "@/components/CustomToast";

export function useRegisterDog() {
  const { mutateAsync: insertDog } = useInsertDog();

  const handleRegister = async ({
    dogImage,
    userId,
    name,
    breed,
    gender,
    birthdate,
  }: {
    dogImage: ImagePicker.ImagePickerAsset[];
    userId: string;
    name: string;
    breed: string;
    gender: string;
    birthdate: Date;
  }) => {
    let uploadUrl = "";

    const image = dogImage[0];

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
      await insertDog({
        userId,
        name,
        breed,
        gender,
        birthdate,
        imageUrl: uploadUrl,
      });

      getGlobalHandleToast("반려견 등록이 완료되었습니다.");
      router.back();
    } catch (_error) {
      getGlobalHandleToast("반려견 등록에 실패했습니다.");
    }
  };

  return {
    handleRegister,
  };
}
