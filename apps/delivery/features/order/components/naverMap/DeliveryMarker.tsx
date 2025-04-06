import SpeechBubble from "@/components/ui/speechBubble";
import { useDriverLocationsInterval } from "@/features/order/api";
import { useOrderStore } from "@/features/order/store/order.store";
import { NaverMapMarkerOverlay } from "@mj-studio/react-native-naver-map";
import { Utensils } from "lucide-react-native";

export default function DeliveryMarker() {
  const { order } = useOrderStore();
  const { data } = useDriverLocationsInterval({ orderId: order?.id ?? 1 });

  return (
    <NaverMapMarkerOverlay
      latitude={data?.lat ?? 0}
      longitude={data?.lon ?? 0}
      anchor={{ x: 0.5, y: 0.5 }}
      width={40}
      height={105}
    >
      <SpeechBubble>
        <Utensils width={20} height={20} stroke={"white"} />
      </SpeechBubble>
    </NaverMapMarkerOverlay>
  );
}
