import { ChevronDown, Search, X } from "lucide-react-native";
import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { addVisitFormOptions } from "@/features/home/constants/add-visit-form";
import {
  COUNTRY_OPTION_MAP,
  COUNTRY_OPTIONS,
} from "@/features/home/utils/country-options";
import { withForm } from "@/hooks/create-app-form";
import i18n from "@/libs/i18n";

export const CountrySelectField = withForm({
  ...addVisitFormOptions,
  render: ({ form }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const insets = useSafeAreaInsets();

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
            setIsModalVisible(false);
            setSearchQuery("");
          };

          return (
            <View className="flex flex-col gap-2">
              <Text className="font-bold text-base text-slate-900 dark:text-white">
                {i18n.t("home.add-visit.country-label") ??
                  "Which country did you visit?"}
              </Text>
              <View className="relative">
                <Pressable
                  className="h-12 w-full flex-row items-center justify-between rounded-xl border border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-800"
                  onPress={() => setIsModalVisible(true)}
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

                <Modal
                  animationType="slide"
                  onRequestClose={() => setIsModalVisible(false)}
                  transparent
                  visible={isModalVisible}
                >
                  <Pressable
                    className="flex-1 bg-black/50"
                    onPress={() => setIsModalVisible(false)}
                  >
                    <Pressable
                      className="mt-auto h-[75%] w-full rounded-t-3xl bg-white dark:bg-slate-900"
                      onPress={(e) => e.stopPropagation()}
                    >
                      <View className="flex-row items-center gap-3 border-slate-200 border-b px-4 pb-4 pt-5 dark:border-slate-800">
                        <View className="flex-1 flex-row items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 dark:bg-slate-800">
                          <Search
                            className="text-slate-500 dark:text-slate-400"
                            size={20}
                          />
                          <TextInput
                            autoFocus
                            className="flex-1 text-base text-slate-900 dark:text-white"
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
                              <X
                                className="text-slate-500 dark:text-slate-400"
                                size={16}
                              />
                            </Pressable>
                          )}
                        </View>
                        <Pressable onPress={() => setIsModalVisible(false)}>
                          <Text className="font-bold text-base text-primary-500">
                            {i18n.t("common.cancel") ?? "Cancel"}
                          </Text>
                        </Pressable>
                      </View>

                      <FlatList
                        contentContainerStyle={{
                          paddingBottom: insets.bottom + 20,
                        }}
                        data={filteredOptions}
                        keyboardShouldPersistTaps="handled"
                        keyExtractor={(item) => item.code}
                        renderItem={({ item }) => (
                          <Pressable
                            className={`flex-row items-center justify-between border-slate-100 border-b px-4 py-3 active:bg-slate-50 dark:border-slate-800 dark:active:bg-slate-800 ${
                              selectedCountry === item.code
                                ? "bg-primary-50 dark:bg-primary-900/20"
                                : ""
                            }`}
                            onPress={() => handleSelect(item.code)}
                          >
                            <Text className="text-base text-slate-900 dark:text-white">
                              {item.flag} {item.label}
                            </Text>
                            {selectedCountry === item.code && (
                              <View className="size-2 rounded-full bg-primary-500" />
                            )}
                          </Pressable>
                        )}
                      />
                    </Pressable>
                  </Pressable>
                </Modal>
              </View>
              <Text className="pl-1 text-slate-400 text-xs dark:text-slate-500">
                {i18n.t("home.add-visit.country-helper") ??
                  "Search by name or let smart fill suggest it for you."}
              </Text>
            </View>
          );
        }}
      </form.AppField>
    );
  },
});
