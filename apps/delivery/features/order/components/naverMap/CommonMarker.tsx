import SpeechBubble from "@/components/ui/speechBubble";
import { NaverMapMarkerOverlay } from "@mj-studio/react-native-naver-map";
import type { ReactNode } from "react";

interface CommonMarkerProps {
  lat: number;
  lon: number;
  children: string | ReactNode;
}

export default function CommonMarker({
  lat,
  lon,
  children,
}: CommonMarkerProps) {
  return (
    <NaverMapMarkerOverlay
      latitude={lat}
      longitude={lon}
      anchor={{ x: 0.5, y: 1 }}
      width={100}
      height={45}
    >
      <SpeechBubble>{children}</SpeechBubble>
    </NaverMapMarkerOverlay>
  );
}
