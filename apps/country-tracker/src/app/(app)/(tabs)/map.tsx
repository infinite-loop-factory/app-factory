import { ErrorBoundary } from "@/components/error-boundary";
import MapScreen from "@/features/map/components/map-screen";

export default function MapContainer() {
  return (
    <ErrorBoundary>
      <MapScreen />
    </ErrorBoundary>
  );
}
