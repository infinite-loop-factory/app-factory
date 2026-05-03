import type { Place, PlaceCategory } from "@/features/place/repo/types";

import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as placeRepo from "@/features/place/repo/place-repo";
import { useThemeColors } from "@/hooks/use-theme-colors";
import i18n from "@/i18n";
import { haptic } from "@/lib/haptics";
import { getCurrentPosition } from "@/services/location";

const CATEGORIES: PlaceCategory[] = [
  "bar",
  "distillery",
  "winery",
  "brewery",
  "restaurant",
  "etc",
];

type Mode = "search" | "newForm";

export type PlacePickerProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (place: Place) => void;
};

export function PlacePicker({ visible, onClose, onSelect }: PlacePickerProps) {
  const colors = useThemeColors();
  const [mode, setMode] = useState<Mode>("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newCategory, setNewCategory] = useState<PlaceCategory | null>(null);
  const [useLocation, setUseLocation] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!visible) {
      setMode("search");
      setQuery("");
      setResults([]);
      setNewName("");
      setNewAddress("");
      setNewCategory(null);
      setUseLocation(false);
      setSaving(false);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible || mode !== "search") return;
    let alive = true;
    const filter = query.trim() ? { query: query.trim() } : {};
    placeRepo.list(filter).then((list) => {
      if (alive) setResults(list);
    });
    return () => {
      alive = false;
    };
  }, [visible, mode, query]);

  const handleSelect = (place: Place) => {
    haptic.selection();
    onSelect(place);
    onClose();
  };

  const handleAddNew = async () => {
    if (!newName.trim() || saving) return;
    setSaving(true);
    let coords: { latitude: number | null; longitude: number | null } = {
      latitude: null,
      longitude: null,
    };
    if (useLocation) {
      const pos = await getCurrentPosition();
      if (pos) {
        coords = { latitude: pos.latitude, longitude: pos.longitude };
      }
    }
    const place = await placeRepo.create({
      name: newName.trim(),
      address: newAddress.trim() || null,
      category: newCategory,
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
    haptic.success();
    onSelect(place);
    onClose();
  };

  const headerTitle =
    mode === "search"
      ? i18n.t("place.picker.title")
      : i18n.t("place.picker.newTitle");

  return (
    <Modal animationType="slide" transparent={false} visible={visible}>
      <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
        <View className="flex-row items-center justify-between border-border-subtle border-b px-4 py-3">
          <Pressable accessibilityRole="button" hitSlop={12} onPress={onClose}>
            <Text className="font-text text-body text-text">
              {i18n.t("common.close")}
            </Text>
          </Pressable>
          <Text className="font-semibold font-text text-body text-text">
            {headerTitle}
          </Text>
          {mode === "newForm" ? (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: !newName.trim() || saving }}
              hitSlop={12}
              onPress={handleAddNew}
            >
              <Text
                className={
                  newName.trim() && !saving
                    ? "font-text text-body text-brand"
                    : "font-text text-body text-text-faint"
                }
              >
                {i18n.t("common.save")}
              </Text>
            </Pressable>
          ) : (
            <View className="w-12" />
          )}
        </View>

        {mode === "search" ? (
          <ScrollView keyboardShouldPersistTaps="handled">
            <View className="p-4">
              <View className="h-12 justify-center rounded-md border border-border-subtle bg-surface-sunken px-3">
                <TextInput
                  autoFocus
                  className="font-text text-body text-text"
                  onChangeText={setQuery}
                  placeholder={i18n.t("place.picker.searchPlaceholder")}
                  placeholderTextColor={colors.textFaint}
                  value={query}
                />
              </View>
            </View>

            {results.length === 0 ? (
              <View className="items-center px-4 py-8">
                <Text className="mb-3 font-text text-body text-text-muted">
                  {i18n.t("place.picker.empty")}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  className="h-11 items-center justify-center rounded-md border border-brand px-4"
                  onPress={() => {
                    setMode("newForm");
                    setNewName(query);
                  }}
                >
                  <Text className="font-medium font-text text-body text-brand">
                    + {i18n.t("place.picker.addNew")}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View>
                {results.map((p) => (
                  <Pressable
                    accessibilityRole="button"
                    className="border-border-subtle border-b px-4 py-3"
                    key={p.id}
                    onPress={() => handleSelect(p)}
                  >
                    <Text className="font-medium font-text text-body text-text">
                      {p.name}
                    </Text>
                    {(p.category || p.address) && (
                      <Text className="mt-0.5 font-text text-caption text-text-muted">
                        {p.category
                          ? i18n.t(`placeCategory.${p.category}` as const)
                          : ""}
                        {p.category && p.address ? " · " : ""}
                        {p.address ?? ""}
                      </Text>
                    )}
                  </Pressable>
                ))}

                <Pressable
                  accessibilityRole="button"
                  className="px-4 py-4"
                  onPress={() => {
                    setMode("newForm");
                    setNewName(query);
                  }}
                >
                  <Text className="font-medium font-text text-body text-brand">
                    + {i18n.t("place.picker.addNew")}
                  </Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerClassName="p-4 pb-12"
            keyboardShouldPersistTaps="handled"
          >
            <View className="h-12 justify-center rounded-md border border-border-subtle bg-surface-sunken px-3">
              <TextInput
                autoFocus
                className="font-text text-body text-text"
                onChangeText={setNewName}
                placeholder={i18n.t("place.picker.namePlaceholder")}
                placeholderTextColor={colors.textFaint}
                value={newName}
              />
            </View>

            <View className="mt-3 h-12 justify-center rounded-md border border-border-subtle bg-surface-sunken px-3">
              <TextInput
                className="font-text text-body text-text"
                onChangeText={setNewAddress}
                placeholder={i18n.t("place.picker.addressPlaceholder")}
                placeholderTextColor={colors.textFaint}
                value={newAddress}
              />
            </View>

            <View className="mt-4 flex-row flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const active = newCategory === c;
                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    className={
                      active
                        ? "h-9 items-center justify-center rounded-pill border border-brand bg-brand-soft px-3"
                        : "h-9 items-center justify-center rounded-pill border border-border-subtle bg-surface px-3"
                    }
                    key={c}
                    onPress={() => {
                      haptic.selection();
                      setNewCategory(c);
                    }}
                  >
                    <Text
                      className={
                        active
                          ? "font-medium font-text text-brand text-caption"
                          : "font-text text-caption text-text-muted"
                      }
                    >
                      {i18n.t(`placeCategory.${c}` as const)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View className="mt-5 flex-row items-center justify-between">
              <Text className="font-text text-body text-text">
                {i18n.t("place.picker.useCurrentLocation")}
              </Text>
              <Switch onValueChange={setUseLocation} value={useLocation} />
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
}
