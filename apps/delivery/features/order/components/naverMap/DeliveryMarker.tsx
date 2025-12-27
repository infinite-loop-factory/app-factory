import { NaverMapMarkerOverlay } from "@mj-studio/react-native-naver-map";
import { Utensils } from "lucide-react-native";
import SpeechBubble from "@/components/ui/speechBubble";
import { useDriverLocationsInterval } from "@/features/order/api";
import { useOrderStore } from "@/features/order/store/order.store";

export default function DeliveryMarker() {
  const { order } = useOrderStore();
  const { data } = useDriverLocationsInterval({ orderId: order?.id ?? 1 });

  return (
    <NaverMapMarkerOverlay
      anchor={{ x: 0.5, y: 0.5 }}
      height={105}
      latitude={data?.lat ?? 0}
      longitude={data?.lon ?? 0}
      width={40}
    >
      <SpeechBubble>
        <Utensils height={20} stroke={"white"} width={20} />
      </SpeechBubble>
    </NaverMapMarkerOverlay>
  );
}
