import type {
  ActivityType,
  TrackingModeType,
} from "@/hooks/location/use-location.ts";

import { noop } from "es-toolkit";
import { memo, useCallback } from "react";
import { Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import CafeBottomSheetContent from "@/components/features/map/cafe-bottom-sheet-content.tsx";
import { CafeMapControls } from "@/components/features/map/controls";
import CafeBottomSheet from "../../../ui/common/disclosure/bottom-sheet";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_STYLE = { width: "100%" } as const;

type Props = {
  activity: ActivityType;
  handleCurrentLocationPress: () => Promise<void>;
  trackingMode: TrackingModeType;
};

const CafeMapBottomSheet = memo(function CafeMapBottomSheet({
  activity,
  handleCurrentLocationPress,
  trackingMode,
}: Props) {
  const animatedPosition = useSharedValue(SCREEN_HEIGHT);

  const stickyContainerStyle = useAnimatedStyle(() => {
    "worklet";

    const MARGIN = -70;
    const ap = animatedPosition.value ?? SCREEN_HEIGHT;

    const sheetHeight = SCREEN_HEIGHT - ap;
    const bottom = Math.min(650, sheetHeight + MARGIN);

    return {
      position: "absolute",
      right: 16,
      bottom,
    };
  });

  const onCurrentLocation = useCallback(() => {
    return handleCurrentLocationPress();
  }, [handleCurrentLocationPress]);

  return (
    <>
      <Animated.View
        pointerEvents="box-none"
        style={[stickyContainerStyle, { zIndex: 10 }]}
      >
        <CafeMapControls
          activity={activity}
          onCurrentLocation={onCurrentLocation}
          trackingMode={trackingMode}
        />
      </Animated.View>

      <CafeBottomSheet
        animatedPosition={animatedPosition}
        enablePanDownToClose={false}
        initialIndex={0}
        isOpen={true}
        onClose={noop}
        showBackdrop={false}
        style={SHEET_STYLE}
      >
        <CafeBottomSheetContent cafeCount={1} />
      </CafeBottomSheet>
    </>
  );
});

export default CafeMapBottomSheet;
