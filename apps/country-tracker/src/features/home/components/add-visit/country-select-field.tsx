import { ChevronDown, Search, X } from "lucide-react-native";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetFlatList,
  ActionsheetItem,
  ActionsheetItemText,
} from "@/components/ui/actionsheet";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { addVisitFormOptions } from "@/features/home/constants/add-visit-form";
import { withForm } from "@/features/home/hooks/create-app-form";
import {
  COUNTRY_OPTION_MAP,
  COUNTRY_OPTIONS,
} from "@/features/home/utils/country-options";
import i18n from "@/lib/i18n";

type CountryOption = (typeof COUNTRY_OPTIONS)[number];

export const CountrySelectField = withForm({
  ...addVisitFormOptions,
  render: ({ form }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    return (
      <form.AppField name="selectedCountry">
        {() => {
          const selectedCountry = form.state.values.selectedCountry ?? null;
          const selectedOption = selectedCountry
            ? COUNTRY_OPTION_MAP.get(selectedCountry)
            : undefined;

          const filteredOptions = COUNTRY_OPTIONS.filter((option) =>
            option.label.toLowerCase().includes(searchQuery.toLowerCase()),
          );

          const handleSelect = (code: string) => {
            form.setFieldValue("selectedCountry", code);
            setIsOpen(false);
            setSearchQuery("");
          };

          const closeSheet = () => {
            setIsOpen(false);
            setSearchQuery("");
          };

          return (
            <View className="flex flex-col gap-2">
              <Text className="font-bold text-base text-slate-900 dark:text-white">
                {i18n.t("home.add-visit.country-label") ??
                  "Which country did you visit?"}
              </Text>
              <Pressable
                className="h-12 w-full flex-row items-center justify-between rounded-xl border border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-800"
                onPress={() => setIsOpen(true)}
              >
                <Text
                  className={`flex-1 text-base ${
                    selectedOption
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {selectedOption
                    ? `${selectedOption.flag} ${selectedOption.label}`
                    : (i18n.t("home.add-visit.country-placeholder") ??
                      "Select country")}
                </Text>
                <ChevronDown
                  className="text-slate-500 dark:text-slate-400"
                  size={20}
                />
              </Pressable>
              <Text className="pl-1 text-slate-400 text-xs dark:text-slate-500">
                {i18n.t("home.add-visit.country-helper") ??
                  "Search by name or let smart fill suggest it for you."}
              </Text>

              <Actionsheet isOpen={isOpen} onClose={closeSheet}>
                <ActionsheetBackdrop />
                <ActionsheetContent className="h-[75%] rounded-t-3xl">
                  <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator />
                  </ActionsheetDragIndicatorWrapper>
                  <Box className="w-full flex-row items-center gap-3 border-outline-100 border-b px-1 pt-2 pb-3">
                    <Box className="flex-1 flex-row items-center gap-2 rounded-xl bg-background-50 px-3 py-2">
                      <Search className="text-typography-500" size={20} />
                      <TextInput
                        autoFocus
                        className="flex-1 text-base text-typography-900"
                        onChangeText={setSearchQuery}
                        placeholder={
                          i18n.t("home.add-visit.search-country") ??
                          "Search country..."
                        }
                        placeholderTextColor="#94a3b8"
                        value={searchQuery}
                      />
                      {searchQuery.length > 0 && (
                        <Pressable onPress={() => setSearchQuery("")}>
                          <X className="text-typography-500" size={16} />
                        </Pressable>
                      )}
                    </Box>
                    <Pressable onPress={closeSheet}>
                      <Text className="font-bold text-base text-primary-600">
                        {i18n.t("common.cancel") ?? "Cancel"}
                      </Text>
                    </Pressable>
                  </Box>
                  <ActionsheetFlatList
                    data={filteredOptions}
                    keyboardShouldPersistTaps="handled"
                    keyExtractor={(item: unknown) =>
                      (item as CountryOption).code
                    }
                    renderItem={({ item }) => {
                      const option = item as CountryOption;
                      const isSelected = selectedCountry === option.code;
                      return (
                        <ActionsheetItem
                          className={isSelected ? "bg-primary-50" : ""}
                          onPress={() => handleSelect(option.code)}
                        >
                          <ActionsheetItemText className="text-base text-typography-900">
                            {option.flag} {option.label}
                          </ActionsheetItemText>
                          {isSelected ? (
                            <Box className="ml-auto size-2 rounded-full bg-primary-500" />
                          ) : null}
                        </ActionsheetItem>
                      );
                    }}
                    style={{ width: "100%" }}
                  />
                </ActionsheetContent>
              </Actionsheet>
            </View>
          );
        }}
      </form.AppField>
    );
  },
});
