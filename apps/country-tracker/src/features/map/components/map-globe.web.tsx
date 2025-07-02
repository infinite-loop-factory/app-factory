import { ThemedView } from "@/components/themed-view";
import { Text } from "@/components/ui/text";
import { forwardRef } from "react";

const MapGlobe = forwardRef(function MapGlobe(_props, _ref) {
  // ref는 웹에서는 무시
  return (
    <ThemedView className="flex-1 items-center justify-center">
      <Text>Map not available on web. Please download our mobile app!</Text>
    </ThemedView>
  );
});

export default MapGlobe;
