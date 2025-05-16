import Button from "@/components/Buttons";
import ImageViewer from "@/components/ImageViewer";
import { View } from "react-native";

const PlaceholderImage = require("../../assets/images/Jennie.png");

export default function Index() {
  return (
    <View className="flex-1 items-center bg-[#0D0D0D]">
      <View className="flex-1">
        <ImageViewer imgSource={PlaceholderImage} />
      </View>

      <View className="flex-[0.33] items-center">
        <Button label="Choose a mix" theme="primary" />
        <Button label="Choose an artist" />
      </View>
    </View>
  );
}
