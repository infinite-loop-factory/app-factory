import { router } from "expo-router";
import { useAtomValue } from "jotai";
import { ChevronLeft, Plus, Trash2 } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Alert, FlatList, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { nationalityAtom } from "@/atoms/nationality.atom";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { getVisaPreset } from "@/constants/visa-presets";
import {
  useDeleteVisaLimitMutation,
  useUpsertVisaLimitMutation,
  useVisaLimitsQuery,
} from "@/features/settings/hooks/use-visa-limits";
import { useThemeColor } from "@/hooks/use-theme-color";
import i18n from "@/lib/i18n";

export function VisaLimitsScreen() {
  const insets = useSafeAreaInsets();
  const nationality = useAtomValue(nationalityAtom);
  const { data: limits = [] } = useVisaLimitsQuery();
  const { mutate: upsertLimit } = useUpsertVisaLimitMutation();
  const { mutate: deleteLimit } = useDeleteVisaLimitMutation();
  const [screenBg, cardBg, borderColor, textMuted, textStrong, errorColor] =
    useThemeColor([
      "background-50",
      "background",
      "outline-100",
      "typography-400",
      "typography-900",
      "error-500",
    ]);

  const [showAdd, setShowAdd] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [maxDays, setMaxDays] = useState("90");
  const [alertBefore, setAlertBefore] = useState("7");

  const handleAdd = useCallback(() => {
    if (!selectedCountry) return;
    upsertLimit({
      countryCode: selectedCountry,
      maxDays: Number.parseInt(maxDays, 10) || 90,
      alertDaysBefore: Number.parseInt(alertBefore, 10) || 7,
    });
    setShowAdd(false);
    setSelectedCountry("");
    setMaxDays("90");
    setAlertBefore("7");
  }, [selectedCountry, maxDays, alertBefore, upsertLimit]);

  const handleDelete = useCallback(
    (id: string, countryCode: string) => {
      Alert.alert(
        i18n.t("visa.delete.title"),
        i18n.t("visa.delete.message", { country: countryCode.toUpperCase() }),
        [
          { text: i18n.t("common.cancel"), style: "cancel" },
          {
            text: i18n.t("visa.delete.confirm"),
            style: "destructive",
            onPress: () => deleteLimit(id),
          },
        ],
      );
    },
    [deleteLimit],
  );

  return (
    <View className="flex-1" style={{ backgroundColor: screenBg }}>
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
        <Heading className="font-bold text-xl" style={{ color: textStrong }}>
          {i18n.t("visa.title")}
        </Heading>
      </Box>

      <Box className="px-4 pb-3">
        <Text className="text-sm" style={{ color: textMuted }}>
          {i18n.t("visa.description")}
        </Text>
      </Box>

      <FlatList
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        data={limits}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <Box className="items-center py-10">
            <Text style={{ color: textMuted }}>{i18n.t("visa.no-limits")}</Text>
          </Box>
        )}
        renderItem={({ item }) => (
          <Box
            className="mb-3 flex-row items-center justify-between rounded-2xl border px-4 py-3"
            style={{ backgroundColor: cardBg, borderColor }}
          >
            <Box>
              <Text
                className="font-semibold text-base"
                style={{ color: textStrong }}
              >
                {item.country_code.toUpperCase()}
              </Text>
              <Text className="mt-1 text-xs" style={{ color: textMuted }}>
                {i18n.t("visa.limit-info", {
                  max: item.max_days,
                  alert: item.alert_days_before,
                })}
              </Text>
            </Box>
            <Pressable
              hitSlop={8}
              onPress={() => handleDelete(item.id, item.country_code)}
            >
              <Trash2 color={errorColor} size={18} />
            </Pressable>
          </Box>
        )}
      />

      {showAdd ? (
        <Box
          className="absolute right-0 bottom-0 left-0 border-t px-4 py-4"
          style={{
            backgroundColor: cardBg,
            borderColor,
            paddingBottom: insets.bottom + 16,
          }}
        >
          <Input className="mb-3 rounded-xl border" style={{ borderColor }}>
            <InputField
              autoCapitalize="characters"
              onChangeText={(val: string) => {
                const upper = val.toUpperCase();
                setSelectedCountry(upper);
                if (upper.length === 2 && nationality) {
                  const preset = getVisaPreset(nationality, upper);
                  if (preset) setMaxDays(String(preset));
                }
              }}
              placeholder={i18n.t("visa.country-placeholder")}
              style={{ color: textStrong }}
              value={selectedCountry}
            />
          </Input>
          <Box className="mb-3 flex-row gap-3">
            <Box className="flex-1">
              <Text className="mb-1 text-xs" style={{ color: textMuted }}>
                {i18n.t("visa.max-days")}
              </Text>
              <Input className="rounded-xl border" style={{ borderColor }}>
                <InputField
                  keyboardType="numeric"
                  onChangeText={setMaxDays}
                  style={{ color: textStrong }}
                  value={maxDays}
                />
              </Input>
            </Box>
            <Box className="flex-1">
              <Text className="mb-1 text-xs" style={{ color: textMuted }}>
                {i18n.t("visa.alert-before")}
              </Text>
              <Input className="rounded-xl border" style={{ borderColor }}>
                <InputField
                  keyboardType="numeric"
                  onChangeText={setAlertBefore}
                  style={{ color: textStrong }}
                  value={alertBefore}
                />
              </Input>
            </Box>
          </Box>
          <Box className="flex-row gap-3">
            <Button
              className="flex-1"
              onPress={() => setShowAdd(false)}
              style={{ borderColor }}
              variant="outline"
            >
              <ButtonText style={{ color: textStrong }}>
                {i18n.t("common.cancel")}
              </ButtonText>
            </Button>
            <Button className="flex-1" onPress={handleAdd}>
              <ButtonText>{i18n.t("visa.save")}</ButtonText>
            </Button>
          </Box>
        </Box>
      ) : (
        <Box
          className="absolute right-0 bottom-0 left-0 px-4"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <Button className="rounded-xl" onPress={() => setShowAdd(true)}>
            <Plus color="white" size={18} />
            <ButtonText className="ml-2">{i18n.t("visa.add-limit")}</ButtonText>
          </Button>
        </Box>
      )}
    </View>
  );
}
