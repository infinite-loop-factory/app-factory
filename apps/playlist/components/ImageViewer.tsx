import { Image, type ImageSourcePropType } from "react-native";

type Props = {
  imgSource: ImageSourcePropType;
};

export default function ImageViewer({ imgSource }: Props) {
  return <Image source={imgSource} className="h-[440px] w-80 rounded-xl" />;
}
