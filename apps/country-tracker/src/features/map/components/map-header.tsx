import { cn } from "@infinite-loop-factory/common";
import { Calendar, Check, ChevronDown, Globe } from "lucide-react-native";
import { Alert, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { useThemeColor } from "@/hooks/use-theme-color";
import i18n from "@/lib/i18n";

interface MapHeaderProps {
  filterMode: "year" | "all" | "range";
  setFilterMode: (mode: "year" | "all" | "range") => void;
  selectedYear: number;
  onOpenYearPicker: () => void;
  onOpenDateRangePicker: () => void;
  onLayout?: (event: { nativeEvent: { layout: { height: number } } }) => void;
  startDate?: string | null;
  endDate?: string | null;
}

export function MapHeader({
  filterMode,
  setFilterMode,
  selectedYear,
  onOpenYearPicker,
  onOpenDateRangePicker,
  onLayout,
  startDate,
  endDate,
}: MapHeaderProps) {
  const insets = useSafeAreaInsets();
  const [accentColor] = useThemeColor(["primary-500"]);

  return (
    <Box className="z-30" onLayout={onLayout}>
      {/* Top Navigation Bar */}
      <Box
        className="flex-row items-center justify-between border-outline-100 border-b bg-background-0 px-4 py-3 shadow-sm dark:border-outline-800 dark:bg-background-900"
        style={{ paddingTop: insets.top }}
      >
        <Box className="flex-row items-center gap-2">
          <Globe className="text-primary-500" color={accentColor} size={24} />
          <Heading className="font-bold text-lg text-typography-900 leading-tight">
            {i18n.t("map.title")}
          </Heading>
        </Box>
        <Button
          onPress={() =>
            Alert.alert("Add Trip", i18n.t("map.alert.not-implemented"))
          }
          variant="link"
        >
          <ButtonText className="font-bold text-base text-primary-500 tracking-wide">
            {i18n.t("map.add-trip")}
          </ButtonText>
        </Button>
      </Box>

      {/* Filters Bar (Chips) */}
      <Box className="border-outline-200 border-b bg-background-0 dark:border-outline-800 dark:bg-background-900">
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            gap: 12,
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {/* All Time */}
          <Button
            className={cn(
              "flex-row items-center gap-2 rounded-full pr-3 pl-4",
              filterMode === "all"
                ? "border-0 bg-primary-500"
                : "bg-background-100 dark:bg-background-800",
            )}
            onPress={() => setFilterMode("all")}
            size="sm"
          >
            <ButtonText
              className={cn(
                "font-medium",
                filterMode === "all"
                  ? "text-typography-0"
                  : "text-typography-700 dark:text-typography-300",
              )}
            >
              {i18n.t("map.filters.all-time")}
            </ButtonText>
            {filterMode === "all" && (
              <ButtonIcon as={Check} className="text-typography-0" size="sm" />
            )}
          </Button>

          {/* Year Picker */}
          <Button
            className={cn(
              "flex-row items-center gap-2 rounded-full pr-3 pl-4",
              filterMode === "year"
                ? "border-0 bg-primary-500"
                : "bg-background-100 dark:bg-background-800",
            )}
            onPress={() => {
              setFilterMode("year");
              onOpenYearPicker();
            }}
            size="sm"
            variant="solid"
          >
            <ButtonText
              className={cn(
                "font-medium",
                filterMode === "year"
                  ? "text-typography-0"
                  : "text-typography-700 dark:text-typography-300",
              )}
            >
              {selectedYear}
            </ButtonText>
            <ButtonIcon
              as={ChevronDown}
              className={
                filterMode === "year"
                  ? "text-typography-0"
                  : "text-typography-500"
              }
              size="sm"
            />
          </Button>

          {/* Date Range Picker */}
          <Button
            className={cn(
              "flex-row items-center gap-2 rounded-full pr-3 pl-4",
              filterMode === "range"
                ? "border-0 bg-primary-500"
                : "bg-background-100 dark:bg-background-800",
            )}
            onPress={() => {
              // setFilterMode("range"); // Don't set immediately, only after selection?
              // Actually, opening picker is enough. User might cancel.
              onOpenDateRangePicker();
            }}
            size="sm"
            variant="solid"
          >
            <ButtonText
              className={cn(
                "font-medium",
                filterMode === "range"
                  ? "text-typography-0"
                  : "text-typography-700 dark:text-typography-300",
              )}
            >
              {filterMode === "range" && startDate && endDate
                ? `${startDate} ~ ${endDate}`
                : i18n.t("map.filters.select-dates")}
            </ButtonText>
            <ButtonIcon
              as={Calendar}
              className={
                filterMode === "range"
                  ? "text-typography-0"
                  : "text-typography-500"
              }
              size="sm"
            />
          </Button>
        </ScrollView>
      </Box>
    </Box>
  );
}
