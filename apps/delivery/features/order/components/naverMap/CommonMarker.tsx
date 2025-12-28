import type { ReactNode } from "react";

import { NaverMapMarkerOverlay } from "@mj-studio/react-native-naver-map";
import SpeechBubble from "@/components/ui/speechBubble";

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
      anchor={{ x: 0.5, y: 1 }}
      height={45}
      latitude={lat}
      longitude={lon}
      width={100}
    >
      <SpeechBubble>{children}</SpeechBubble>
    </NaverMapMarkerOverlay>
  );
}
