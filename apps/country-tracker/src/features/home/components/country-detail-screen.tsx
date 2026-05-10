import type { CountryItem } from "@/types/country-item";

import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ChevronLeft, Edit3, Trash2 } from "lucide-react-native";
import { useCallback } from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { queryKeys } from "@/constants/query-keys";
import { useDeleteVisitMutation } from "@/features/home/hooks/use-delete-visit";
import { fetchVisitedCountries } from "@/features/map/apis/fetch-visited-countries";
import { useAuthUser } from "@/hooks/use-auth-user";
import { useThemeColor } from "@/hooks/use-theme-color";
import i18n from "@/lib/i18n";
import { getFlagUri, getStayDays } from "@/utils/country-region";
import { formatIsoDate } from "@/utils/format-date";
import { triggerHaptic } from "@/utils/haptics";

interface Props {
  countryCode: string;
}

export function CountryDetailScreen({ countryCode }: Props) {
  const { user } = useAuthUser();
  const insets = useSafeAreaInsets();
  const { mutate: deleteVisit } = useDeleteVisitMutation();
  const [
    screenBg,
    cardBg,
    borderColor,
    textMuted,
    textStrong,
    primaryColor,
    warningSurface,
    warningText,
    errorColor,
  ] = useThemeColor([
    "background-50",
    "background",
    "outline-100",
    "typography-400",
    "typography-900",
    "primary-300",
    "warning-0",
    "warning-600",
    "error-500",
  ]);

  const { data: allCountries = [] } = useQuery({
    queryKey: [...queryKeys.location.visitedCountries(), user?.id ?? "guest"],
    enabled: Boolean(user?.id),
    queryFn: () => (user?.id ? fetchVisitedCountries(user.id) : []),
  });

  // Filter visits for this country
  const countryVisits = allCountries.filter(
    (item) => item.country_code.toLowerCase() === countryCode.toLowerCase(),
  );

  const countryName = countryVisits[0]?.country ?? countryCode;
  const flagUri = getFlagUri(countryCode);
  const totalDays = countryVisits.reduce((sum, v) => sum + getStayDays(v), 0);
  const totalVisits = countryVisits.length;
  const firstVisit =
    countryVisits.length > 0
      ? formatIsoDate(
          countryVisits[countryVisits.length - 1]?.startDate ?? "",
          { format: "MMM yyyy", fallback: "--" },
        )
      : "--";
  const lastVisit =
    countryVisits.length > 0
      ? formatIsoDate(countryVisits[0]?.endDate ?? "", {
          format: "MMM yyyy",
          fallback: "--",
        })
      : "--";

  const handleEdit = useCallback((item: CountryItem) => {
    triggerHaptic("light");
    router.push({
      pathname: "/add-visit",
      params: {
        mode: "edit",
        countryCode: item.country_code,
        country: item.country,
        startDate: item.startDate,
        endDate: item.endDate,
        dateSet: JSON.stringify(item.dateSet),
      },
    });
  }, []);

  const handleDelete = useCallback(
    (item: CountryItem) => {
      triggerHaptic("medium");
      const stayDays = getStayDays(item);
      Alert.alert(
        i18n.t("home.delete-visit.title"),
        i18n.t("home.delete-visit.message", {
          count: stayDays,
          country: item.country,
        }),
        [
          { text: i18n.t("home.delete-visit.cancel"), style: "cancel" },
          {
            text: i18n.t("home.delete-visit.confirm"),
            style: "destructive",
            onPress: () => deleteVisit(item),
          },
        ],
      );
    },
    [deleteVisit],
  );

  return (
    <View className="flex-1" style={{ backgroundColor: screenBg }}>
      {/* Header */}
      <Box
        className="flex-row items-center gap-3 px-4 pb-4"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full border"
          onPress={() => router.back()}
          style={{ borderColor, backgroundColor: cardBg }}
        >
          <ChevronLeft color={textStrong} size={20} />
        </Pressable>
        <Box
          className="h-10 w-10 items-center justify-center overflow-hidden rounded-lg border"
          style={{ borderColor }}
        >
          {flagUri ? (
            <Image
              alt={`${countryName} flag`}
              className="h-full w-full"
              source={{ uri: flagUri }}
            />
          ) : (
            <Text className="text-xl">{countryVisits[0]?.flag ?? "🏳️"}</Text>
          )}
        </Box>
        <Heading className="font-bold text-xl" style={{ color: textStrong }}>
          {countryName}
        </Heading>
      </Box>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Stats */}
        <Box className="mb-4 flex-row gap-3">
          {[
            {
              label: i18n.t("country-detail.total-visits"),
              value: String(totalVisits),
            },
            {
              label: i18n.t("country-detail.total-days"),
              value: String(totalDays),
            },
            { label: i18n.t("country-detail.first-visit"), value: firstVisit },
            { label: i18n.t("country-detail.last-visit"), value: lastVisit },
          ].map((stat) => (
            <Box
              className="flex-1 items-center rounded-xl border px-2 py-3"
              key={stat.label}
              style={{ backgroundColor: cardBg, borderColor }}
            >
              <Text className="font-bold text-lg" style={{ color: textStrong }}>
                {stat.value}
              </Text>
              <Text className="mt-1 text-xs" style={{ color: textMuted }}>
                {stat.label}
              </Text>
            </Box>
          ))}
        </Box>

        {/* Timeline */}
        <Heading
          className="mb-3 font-bold text-lg"
          style={{ color: textStrong }}
        >
          {i18n.t("country-detail.visit-history")}
        </Heading>

        <VStack space="sm">
          {countryVisits.map((visit) => {
            const stayDays = getStayDays(visit);
            const start = formatIsoDate(visit.startDate, {
              format: "MMM dd, yyyy",
              fallback: "--",
            });
            const end = formatIsoDate(visit.endDate, {
              format: "MMM dd, yyyy",
              fallback: "--",
            });
            const isSameDay = visit.startDate === visit.endDate;

            return (
              <Box
                className="flex-row items-center justify-between rounded-2xl border px-4 py-3"
                key={visit.id}
                style={{ backgroundColor: cardBg, borderColor }}
              >
                <Box className="flex-1">
                  <Text
                    className="font-semibold text-base"
                    style={{ color: textStrong }}
                  >
                    {isSameDay ? start : `${start} — ${end}`}
                  </Text>
                  <Badge
                    className="mt-1 self-start rounded-full"
                    size="sm"
                    style={{ backgroundColor: warningSurface }}
                  >
                    <BadgeText style={{ color: warningText }}>
                      {i18n.t("home.list.stay-days", { count: stayDays })}
                    </BadgeText>
                  </Badge>
                </Box>
                <Box className="flex-row gap-3">
                  <Pressable hitSlop={8} onPress={() => handleEdit(visit)}>
                    <Edit3 color={primaryColor} size={18} />
                  </Pressable>
                  <Pressable hitSlop={8} onPress={() => handleDelete(visit)}>
                    <Trash2 color={errorColor} size={18} />
                  </Pressable>
                </Box>
              </Box>
            );
          })}
        </VStack>

        {countryVisits.length === 0 && (
          <Box className="items-center py-10">
            <Text style={{ color: textMuted }}>
              {i18n.t("country-detail.no-visits")}
            </Text>
          </Box>
        )}
      </ScrollView>
    </View>
  );
}
