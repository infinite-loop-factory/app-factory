import type { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import type { SharedValue } from "react-native-reanimated";
import type { CountryItem } from "@/types/country-item";

import { Trash2 } from "lucide-react-native";
import { useRef } from "react";
import { Platform, TouchableOpacity } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { useThemeColor } from "@/hooks/use-theme-color";
import i18n from "@/lib/i18n";
import { getFlagUri, getStayDays } from "@/utils/country-region";
import { formatIsoDate } from "@/utils/format-date";
import { triggerHaptic } from "@/utils/haptics";

interface SwipeableCountryCardProps {
  item: CountryItem;
  onDelete: (item: CountryItem) => void;
  onPress: (item: CountryItem) => void;
}

function DeleteAction({
  dragX,
  errorColor,
  onPress,
}: {
  dragX: SharedValue<number>;
  errorColor: string;
  onPress: () => void;
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(dragX.value, [-80, 0], [1, 0], "clamp"),
      },
    ],
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: errorColor,
        justifyContent: "center",
        alignItems: "center",
        width: 80,
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
        marginBottom: 12,
      }}
    >
      <Animated.View style={animatedStyle}>
        <Trash2 color="white" size={22} />
        <Text className="mt-1 text-center font-semibold text-white text-xs">
          {i18n.t("home.delete-visit.confirm")}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export function SwipeableCountryCard({
  item,
  onDelete,
  onPress,
}: SwipeableCountryCardProps) {
  const swipeableRef = useRef<SwipeableMethods>(null);
  const [
    cardBg,
    borderColor,
    textMuted,
    textStrong,
    badgeSurface,
    badgeText,
    badgeFilledSurface,
    badgeFilledText,
    secondarySurface,
    errorColor,
    primaryColor,
  ] = useThemeColor([
    "background",
    "outline-100",
    "typography-500",
    "typography-900",
    "primary-50",
    "primary-600",
    "primary-500",
    "typography-0",
    "secondary-0",
    "error-500",
    "primary-500",
  ]);

  const flagUri = getFlagUri(item.country_code);
  const stayDays = getStayDays(item);
  const lastVisited = formatIsoDate(item.endDate, {
    format: "LLL yyyy",
    fallback: "--",
  });

  const renderRightActions = (
    _progress: SharedValue<number>,
    dragX: SharedValue<number>,
  ) => (
    <DeleteAction
      dragX={dragX}
      errorColor={errorColor ?? "#ef4444"}
      onPress={() => {
        swipeableRef.current?.close();
        triggerHaptic("medium");
        onDelete(item);
      }}
    />
  );

  const cardContent = (
    <TouchableOpacity
      accessibilityLabel={`country-card-${item.country_code}`}
      activeOpacity={0.7}
      onPress={() => onPress(item)}
      testID={`country-card-${item.country_code}`}
    >
      <Box
        className="mb-3 flex-row items-center justify-between rounded-2xl border px-3 py-3 shadow-sm"
        style={{ backgroundColor: cardBg, borderColor }}
      >
        <Box className="flex-row items-center gap-3">
          <Box
            className="h-14 w-14 items-center justify-center overflow-hidden rounded-xl border"
            style={{ backgroundColor: secondarySurface, borderColor }}
          >
            {flagUri ? (
              <Image
                alt={`${item.country} flag`}
                className="h-full w-full"
                source={{ uri: flagUri }}
              />
            ) : (
              <Text className="text-2xl" style={{ color: textStrong }}>
                {item.flag}
              </Text>
            )}
          </Box>
          <Box className="flex-1">
            <Text
              className="font-semibold text-lg"
              style={{ color: textStrong }}
            >
              {item.country}
            </Text>
            <Box className="mt-1 flex-row items-center gap-2">
              <Text className="text-xs" style={{ color: textMuted }}>
                {i18n.t("home.list.last-visit", { date: lastVisited })}
              </Text>
              {(item.visitCount ?? 0) > 1 && (
                <Text className="text-xs" style={{ color: primaryColor }}>
                  {i18n.t("home.list.visit-count", { count: item.visitCount })}
                </Text>
              )}
            </Box>
          </Box>
        </Box>
        <Box className="items-end gap-1">
          <Badge
            className="rounded-full px-3 py-1"
            size="sm"
            style={{
              backgroundColor:
                stayDays >= 30 ? badgeFilledSurface : badgeSurface,
            }}
          >
            <BadgeText
              className="font-semibold"
              style={{
                color: stayDays >= 30 ? badgeFilledText : badgeText,
              }}
            >
              {i18n.t("home.list.stay-days", { count: stayDays })}
            </BadgeText>
          </Badge>
        </Box>
      </Box>
    </TouchableOpacity>
  );

  if (Platform.OS === "web") {
    return cardContent;
  }

  return (
    <ReanimatedSwipeable
      friction={2}
      overshootRight={false}
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
    >
      {cardContent}
    </ReanimatedSwipeable>
  );
}
