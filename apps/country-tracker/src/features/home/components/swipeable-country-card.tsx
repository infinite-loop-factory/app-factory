import type { CountryItem } from "@/types/country-item";

import { Trash2 } from "lucide-react-native";
import { useRef } from "react";
import { Animated, Platform, TouchableOpacity } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
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

export function SwipeableCountryCard({
  item,
  onDelete,
  onPress,
}: SwipeableCountryCardProps) {
  const swipeableRef = useRef<Swipeable>(null);
  const [
    cardBg,
    borderColor,
    textMuted,
    textStrong,
    warningSurface,
    warningText,
    secondarySurface,
    errorColor,
    primaryColor,
  ] = useThemeColor([
    "background",
    "outline-100",
    "typography-400",
    "typography-900",
    "warning-0",
    "warning-600",
    "secondary-0",
    "error-500",
    "primary-300",
  ]);

  const flagUri = getFlagUri(item.country_code);
  const stayDays = getStayDays(item);
  const lastVisited = formatIsoDate(item.endDate, {
    format: "LLL yyyy",
    fallback: "--",
  });

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <TouchableOpacity
        onPress={() => {
          swipeableRef.current?.close();
          triggerHaptic("medium");
          onDelete(item);
        }}
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
        <Animated.View style={{ transform: [{ scale }] }}>
          <Trash2 color="white" size={22} />
          <Text className="mt-1 text-center font-semibold text-white text-xs">
            {i18n.t("home.delete-visit.confirm")}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const cardContent = (
    <TouchableOpacity activeOpacity={0.7} onPress={() => onPress(item)}>
      <Box
        className="mb-3 flex-row items-center justify-between rounded-2xl border px-3 py-3"
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
            className="rounded-full"
            size="sm"
            style={{ backgroundColor: warningSurface }}
          >
            <BadgeText style={{ color: warningText }}>
              {i18n.t("home.list.stay-days", { count: stayDays })}
            </BadgeText>
          </Badge>
          {Platform.OS === "web" && (
            <TouchableOpacity
              hitSlop={8}
              onPress={(e) => {
                e.stopPropagation();
                onDelete(item);
              }}
            >
              <Trash2 color={errorColor} size={16} />
            </TouchableOpacity>
          )}
        </Box>
      </Box>
    </TouchableOpacity>
  );

  if (Platform.OS === "web") {
    return cardContent;
  }

  return (
    <Swipeable
      friction={2}
      overshootRight={false}
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
    >
      {cardContent}
    </Swipeable>
  );
}
