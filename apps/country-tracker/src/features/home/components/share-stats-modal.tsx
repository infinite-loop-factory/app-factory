import type { CountryItem } from "@/types/country-item";

import { X } from "lucide-react-native";
import { Modal, Pressable } from "react-native";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { ShareableStatsCard } from "@/features/map/components/shareable-stats-card";
import { useShareStats } from "@/features/map/hooks/use-share-stats";
import { useThemeColor } from "@/hooks/use-theme-color";
import i18n from "@/lib/i18n";
import { getStayDays } from "@/utils/country-region";

interface ShareStatsModalProps {
  visible: boolean;
  onClose: () => void;
  userName: string;
  countries: CountryItem[];
}

export function ShareStatsModal({
  visible,
  onClose,
  userName,
  countries,
}: ShareStatsModalProps) {
  const { viewShotRef, share } = useShareStats();
  const [screenBg, textStrong] = useThemeColor([
    "background-50",
    "typography-900",
  ]);

  const countriesCount = new Set(countries.map((c) => c.country_code)).size;
  const totalDays = countries.reduce((sum, c) => sum + getStayDays(c), 0);

  // Aggregate by country
  const countryMap = new Map<
    string,
    { country: string; countryCode: string; days: number }
  >();
  for (const c of countries) {
    const existing = countryMap.get(c.country_code);
    if (existing) {
      existing.days += getStayDays(c);
    } else {
      countryMap.set(c.country_code, {
        country: c.country,
        countryCode: c.country_code,
        days: getStayDays(c),
      });
    }
  }
  const topCountries = [...countryMap.values()].sort((a, b) => b.days - a.days);

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <Box
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          style={{
            backgroundColor: screenBg,
            borderRadius: 24,
            padding: 20,
            margin: 20,
            maxWidth: 400,
            width: "90%",
            gap: 16,
          }}
        >
          <Box
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "700", color: textStrong }}
            >
              {i18n.t("share.title")}
            </Text>
            <Pressable hitSlop={8} onPress={onClose}>
              <X color={textStrong} size={20} />
            </Pressable>
          </Box>

          <ShareableStatsCard
            countriesCount={countriesCount}
            ref={viewShotRef}
            topCountries={topCountries}
            totalDays={totalDays}
            userName={userName}
          />

          <Button className="rounded-xl" onPress={() => void share()}>
            <ButtonText>{i18n.t("share.title")}</ButtonText>
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
