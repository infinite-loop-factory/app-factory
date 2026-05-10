import type { CountryItem } from "@/types/country-item";

import { X } from "lucide-react-native";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { ShareableStatsCard } from "@/features/map/components/shareable-stats-card";
import { useShareStats } from "@/features/map/hooks/use-share-stats";
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

  const countriesCount = new Set(countries.map((c) => c.country_code)).size;
  const totalDays = countries.reduce((sum, c) => sum + getStayDays(c), 0);

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
    <Modal isOpen={visible} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="max-w-md rounded-2xl">
        <ModalHeader>
          <Heading className="font-bold text-lg text-typography-900">
            {i18n.t("share.title")}
          </Heading>
          <ModalCloseButton>
            <Icon as={X} size="md" />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Box className="gap-4 py-2">
            <ShareableStatsCard
              countriesCount={countriesCount}
              ref={viewShotRef}
              topCountries={topCountries}
              totalDays={totalDays}
              userName={userName}
            />
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            action="primary"
            className="w-full rounded-xl"
            onPress={() => void share()}
          >
            <ButtonText>{i18n.t("share.title")}</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
