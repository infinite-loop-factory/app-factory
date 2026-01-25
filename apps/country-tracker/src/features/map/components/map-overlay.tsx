import { LocateFixed, Minus, Plus, Search } from "lucide-react-native";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import i18n from "@/lib/i18n";

interface MapOverlayProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  onSearchSubmit: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocateMe?: () => void;
}

export function MapOverlay({
  searchText,
  onSearchChange,
  onSearchSubmit,
  onZoomIn,
  onZoomOut,
  onLocateMe,
}: MapOverlayProps) {
  return (
    <Box className="pointer-events-none absolute inset-0 z-10 flex-col justify-between p-4 pb-64">
      {/* Floating Search Bar */}
      <Box className="pointer-events-auto mx-auto w-full max-w-md shadow-lg">
        <Input
          className="h-12 w-full rounded-xl border-0 bg-background-0 shadow-lg dark:bg-background-900"
          size="lg"
        >
          <InputSlot className="pl-4">
            <InputIcon as={Search} className="text-typography-400" />
          </InputSlot>
          <InputField
            className="text-base"
            onChangeText={onSearchChange}
            onSubmitEditing={onSearchSubmit}
            placeholder={i18n.t("map.search-placeholder")}
            value={searchText}
          />
        </Input>
      </Box>

      {/* Zoom Controls (Dummy for UI match) */}
      <Box className="pointer-events-auto mt-4 flex-col gap-2 self-end">
        <Box className="flex-col overflow-hidden rounded-xl bg-background-0 shadow-lg dark:bg-background-900">
          <Button
            className="h-10 w-10 items-center justify-center border-outline-100 border-b p-0 dark:border-outline-700"
            onPress={onZoomIn}
            variant="link"
          >
            <ButtonIcon
              as={Plus}
              className="text-typography-700 dark:text-typography-200"
            />
          </Button>
          <Button
            className="h-10 w-10 items-center justify-center p-0"
            onPress={onZoomOut}
            variant="link"
          >
            <ButtonIcon
              as={Minus}
              className="text-typography-700 dark:text-typography-200"
            />
          </Button>
        </Box>

        <Button
          className="h-10 w-10 items-center justify-center rounded-xl bg-background-0 p-0 shadow-lg dark:bg-background-900"
          onPress={onLocateMe}
          variant="link"
        >
          <ButtonIcon as={LocateFixed} className="text-primary-500" />
        </Button>
      </Box>
    </Box>
  );
}
