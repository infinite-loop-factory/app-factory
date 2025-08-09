import type { PoiItem } from "@/api/reactQuery/tmap/useFetchSearchLocations";

import { router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type LocationResultCardProp = {
  item: PoiItem;
  type: "START" | "END";
};

export default function LocationResultCard({
  item,
  type,
}: LocationResultCardProp) {
  const {
    roadName,
    firstBuildNo,
    upperAddrName,
    middleAddrName,
    lowerAddrName,
    name,
    frontLat,
    frontLon,
  } = item;

  const roadAddress = `${roadName ?? ""} ${firstBuildNo ?? ""}`.trim();
  const jibunAddress =
    `${upperAddrName} ${middleAddrName} ${lowerAddrName}`.trim();

  return (
    <TouchableOpacity
      className="w-full px-1 py-3"
      onPress={() => {
        router.push({
          pathname: "/(screens)/location/confirm",
          params: {
            type,
            name,
            frontLat,
            frontLon,
          },
        });
      }}
    >
      <VStack className="gap-1">
        <Text className="font-semibold" size="lg">
          {item.name}
        </Text>
        <Text>{roadAddress || jibunAddress}</Text>
      </VStack>
    </TouchableOpacity>
  );
}
