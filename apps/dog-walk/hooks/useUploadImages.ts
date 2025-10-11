import type * as ImagePicker from "expo-image-picker";

import { decode } from "base64-arraybuffer";
import { supabase } from "@/api/supabaseClient";
import { getGlobalHandleToast } from "@/components/CustomToast";

export const useUploadImages = () => {
  const handleUploadImages = async (images: ImagePicker.ImagePickerAsset[]) => {
    const uploadedUrls: string[] = [];

    if (images.length === 0) return { uploadedUrls: "" };

    for (const image of images) {
      const fileExt = image.uri.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `private/${fileName}`;

      if (!image.base64) {
        getGlobalHandleToast("이미지를 처리할 수 없습니다.");
        return { uploadedUrls: "" };
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
        return { uploadedUrls: "" };
      }

      try {
        const { data } = supabase.storage
          .from("dog-walk-images")
          .getPublicUrl(filePath);

        uploadedUrls.push(data.publicUrl);
      } catch (_error) {
        getGlobalHandleToast("업로드된 이미지 조회에 실패했습니다.");
        return { uploadedUrls: "" };
      }
    }
    return { uploadedUrls: JSON.stringify(uploadedUrls) };
  };

  return {
    handleUploadImages,
  };
};
