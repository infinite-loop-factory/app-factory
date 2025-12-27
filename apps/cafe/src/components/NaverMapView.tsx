import { Linking, Text, TouchableOpacity, View } from "react-native";

interface NaverMapViewProps {
  address: string;
  width?: number;
  height?: number;
}

/**
 * A component that displays a static Naver Map image and provides a link to open the full map
 */
export function NaverMapView({
  address,
  width = 300,
  height = 200,
}: NaverMapViewProps) {
  // Function to open Naver Maps in browser with the address
  const openNaverMap = () => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://map.naver.com/v5/search/${encodedAddress}`;
    Linking.openURL(url);
  };

  // Create a placeholder image with the address text
  // In a real implementation, you would use Naver Static Map API with an API key
  return (
    <View className="my-2">
      <TouchableOpacity
        className="overflow-hidden rounded-lg"
        onPress={openNaverMap}
        style={{ width, height }}
      >
        <View className="h-full w-full items-center justify-center bg-gray-200 p-3">
          <Text className="mb-2 text-center text-gray-700">{address}</Text>
          <Text className="font-bold text-blue-500">네이버 지도로 보기</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
