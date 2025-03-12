import { ThemedView } from "@/components/ThemedView";
import MapGlobe from "@/features/map/components/map-globe";

export default function MapScreen() {
  return (
    <ThemedView className="flex-1">
      <MapGlobe />
    </ThemedView>
  );
}
