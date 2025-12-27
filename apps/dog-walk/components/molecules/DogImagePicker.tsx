import * as ImagePicker from "expo-image-picker";
import { Camera } from "lucide-react-native";
import { Image, TouchableOpacity, View } from "react-native";
import { Icon } from "../ui/icon";

interface IDogImagePickerProps {
  dogImage: ImagePicker.ImagePickerAsset[];
  setDogImage: React.Dispatch<
    React.SetStateAction<ImagePicker.ImagePickerAsset[]>
  >;
}

export default function DogImagePicker({
  dogImage,
  setDogImage,
}: IDogImagePickerProps) {
  const onPickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (result && !result.canceled && result.assets[0]) {
      const image = result.assets[0];
      setDogImage(() => [image]);
    }
  };

  return (
    <TouchableOpacity onPress={onPickImage}>
      {!!dogImage.length && (
        <Image className="h-28 w-28 rounded-full" src={dogImage[0]?.uri} />
      )}
      {!dogImage.length && (
        <View className="relative">
          <View
            className={
              "flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-slate-100"
            }
          >
            <Icon as={Camera} className="h-8 w-8 text-slate-400" />
          </View>
          <View className="absolute right-0 bottom-0 cursor-pointer rounded-full bg-primary-500 p-2">
            <Icon as={Camera} className="h-4 w-4 text-white" />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}
