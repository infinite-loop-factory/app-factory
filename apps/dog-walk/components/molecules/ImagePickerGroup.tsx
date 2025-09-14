import * as ImagePicker from "expo-image-picker";
import { Camera } from "lucide-react-native";
import { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import ImageOptionsSheet from "../actionsheet/ImageOptionsSheet";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

interface ImagePickerGroupProps {
  maxLength: number;
  images: ImagePicker.ImagePickerAsset[];
  setImages: React.Dispatch<
    React.SetStateAction<ImagePicker.ImagePickerAsset[]>
  >;
}

export default function ImagePickerGroup({
  maxLength,
  images,
  setImages,
}: ImagePickerGroupProps) {
  const [showImageOptionActionsheet, setShowImageOptionActionsheet] =
    useState(false);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (result && !result.canceled && result.assets[0]) {
      const image = result.assets[0];

      setImages((prev) => [...prev, image]);
    }
  };

  return (
    <HStack className="gap-2">
      {images.map((data, index) => (
        <TouchableOpacity
          key={`image_${data.uri}_${index}`}
          onPress={() => {
            setShowImageOptionActionsheet(true);
            setSelectedImageIndex(index);
          }}
        >
          <View className="h-20 w-20 overflow-hidden rounded-xl">
            <Image className="h-full w-full" src={data?.uri} />
          </View>
        </TouchableOpacity>
      ))}
      {images.length < maxLength && (
        <TouchableOpacity
          className="h-20 w-20 items-center justify-center rounded-xl bg-slate-50"
          onPress={pickImage}
        >
          <VStack className="items-center justify-center gap-1">
            <Icon as={Camera} className="text-slate-400" />
            <Text className="text-slate-400" size="xs">
              사진 추가
            </Text>
          </VStack>
        </TouchableOpacity>
      )}
      {/* NOTE: MODAL ==> */}
      <ImageOptionsSheet
        handleDelete={() => {
          setShowImageOptionActionsheet(false);
          setImages((prev) => {
            const copied = [...prev];
            const filteredImages = copied.filter(
              (_data, index) => index !== selectedImageIndex,
            );

            return filteredImages;
          });
        }}
        setShowActionsheet={setShowImageOptionActionsheet}
        showActionsheet={showImageOptionActionsheet}
      />

      {/* NOTE: <== MODAL */}
    </HStack>
  );
}
