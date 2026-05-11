import { Globe, PlaneTakeoff } from "lucide-react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useThemeColor } from "@/hooks/use-theme-color";
import i18n from "@/lib/i18n";

interface MapStatsProps {
  countryCount: number;
  totalDays: number;
}

export function MapStats({ countryCount, totalDays }: MapStatsProps) {
  const [accentColor] = useThemeColor(["primary-500"]);

  const [mutedColor] = useThemeColor(["typography-500"]);

  return (
    <Box className="flex-row gap-3">
      <Box
        className="flex-col items-center gap-1 rounded-xl border border-outline-200 bg-background-50 p-4 text-center dark:border-outline-700 dark:bg-background-800/50"
        style={{ flex: 2 }}
      >
        <Text className="font-bold text-3xl text-typography-900 leading-tight">
          {countryCount}
        </Text>
        <Box className="flex-row items-center gap-1.5">
          <Globe color={accentColor} size={16} />
          <Text className="font-semibold text-typography-700 text-xs uppercase tracking-wide dark:text-typography-300">
            {i18n.t("map.stats.countries")}
          </Text>
        </Box>
      </Box>
      <Box
        className="flex-col items-center gap-1 rounded-xl border border-outline-200 bg-background-50 p-3 text-center dark:border-outline-700 dark:bg-background-800/50"
        style={{ flex: 1 }}
      >
        <Text className="font-semibold text-2xl text-typography-900 leading-tight">
          {totalDays}
        </Text>
        <Box className="flex-row items-center gap-1.5 opacity-80">
          <PlaneTakeoff color={mutedColor} size={14} />
          <Text
            className="font-medium text-typography-600 text-xs uppercase tracking-wide dark:text-typography-300"
            numberOfLines={1}
          >
            {i18n.t("map.stats.days-abroad-short")}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
