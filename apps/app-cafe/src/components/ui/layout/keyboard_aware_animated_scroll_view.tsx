import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import Animated, {
  type SharedValue,
  useAnimatedRef,
  useScrollOffset,
} from "react-native-reanimated";

type Props = React.ComponentProps<typeof Animated.ScrollView> & {
  keyboardVerticalOffset?: number;
  onScrollY?: (y: SharedValue<number>) => void; // 필요할 때만
};

export function KeyboardAwareAnimatedScrollView({
  keyboardVerticalOffset = 0,
  onScrollY,
  ...props
}: Props) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useScrollOffset(scrollRef);

  React.useEffect(() => {
    onScrollY?.(scrollY);
  }, [onScrollY]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={{ flex: 1 }}
    >
      <Animated.ScrollView
        keyboardShouldPersistTaps="handled"
        ref={scrollRef}
        scrollEventThrottle={16}
        {...props}
      />
    </KeyboardAvoidingView>
  );
}
