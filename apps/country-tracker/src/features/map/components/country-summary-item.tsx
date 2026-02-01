import type { CountryYearSummary } from "@/features/map/types/map-summary";

import { ArrowRight, CalendarDays } from "lucide-react-native";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { useThemeColor } from "@/hooks/use-theme-color";
import i18n from "@/lib/i18n";

interface CountrySummaryItemProps {
  item: CountryYearSummary;
  onPress: (item: CountryYearSummary) => void;
}

export function CountrySummaryItem({ item, onPress }: CountrySummaryItemProps) {
  const [mutedTextColor] = useThemeColor(["typography-500"]);

  return (
    <Box className="mb-4 overflow-hidden rounded-xl border border-outline-100 bg-background-0 p-3 shadow-sm dark:border-outline-800 dark:bg-background-800">
      <Box className="flex-row gap-4">
        {/* Content */}
        <Box className="flex-1 justify-center gap-3">
          <Box className="flex-col gap-0.5">
            <Box className="flex-row items-center gap-2">
              <Heading className="font-bold text-typography-900" size="md">
                {item.country}
              </Heading>
              <Box className="rounded-md border border-green-600/20 bg-success-50 px-2 py-1 dark:bg-green-900/30">
                <Text className="font-medium text-success-700 text-xs dark:text-success-400">
                  {i18n.t("map.active")}
                </Text>
              </Box>
            </Box>
            <Box className="flex-row items-center gap-1">
              <CalendarDays color={mutedTextColor} size={16} />
              <Text className="font-medium text-sm text-typography-500">
                {i18n.t("map.summary.days", { count: item.totalDays })}
              </Text>
            </Box>
          </Box>
          <Button
            action="primary"
            className="mt-1 h-9 w-full justify-between bg-primary-500/10 px-3 data-[hover=true]:bg-primary-500/20 dark:bg-primary-500/20 dark:data-[hover=true]:bg-primary-500/30"
            onPress={() => onPress(item)}
            size="sm"
            variant="solid"
          >
            <ButtonText className="font-bold text-primary-500 text-sm">
              {i18n.t("map.view-trips")}
            </ButtonText>
            <ButtonIcon
              as={ArrowRight}
              className="text-primary-500"
              size="sm"
            />
          </Button>
        </Box>

        {/* Image / Map Placeholder */}
        <Box className="h-[100px] w-[100px] overflow-hidden rounded-lg bg-background-50 dark:bg-background-900">
          <Box className="h-full w-full items-center justify-center bg-outline-100 dark:bg-outline-800">
            <Text className="text-4xl">{item.flag}</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
