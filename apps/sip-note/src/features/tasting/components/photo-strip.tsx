import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { Path, Svg } from "react-native-svg";
import i18n from "@/i18n";
import * as photoService from "@/services/photo";

export type PhotoStripProps = {
  photos: string[];
  onChange: (next: string[]) => void;
  max?: number;
};

export function PhotoStrip({ photos, onChange, max = 5 }: PhotoStripProps) {
  const addFromCamera = async () => {
    const uri = await photoService.takePhoto();
    if (uri) onChange([...photos, uri].slice(0, max));
  };

  const addFromGallery = async () => {
    const uri = await photoService.pickPhoto();
    if (uri) onChange([...photos, uri].slice(0, max));
  };

  const remove = (uri: string) => {
    onChange(photos.filter((p) => p !== uri));
  };

  const canAddMore = photos.length < max;

  return (
    <ScrollView
      contentContainerClassName="gap-2 py-1"
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {photos.map((uri) => (
        <View
          className="h-20 w-20 overflow-hidden rounded-md bg-surface-sunken"
          key={uri}
        >
          <Image className="h-full w-full" source={{ uri }} />
          <Pressable
            accessibilityLabel="사진 제거"
            accessibilityRole="button"
            className="absolute top-1 right-1 h-5 w-5 items-center justify-center rounded-pill bg-overlay"
            onPress={() => remove(uri)}
            style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
          >
            <Svg fill="none" height={10} viewBox="0 0 24 24" width={10}>
              <Path
                d="M6 6l12 12M18 6L6 18"
                stroke="#fff"
                strokeLinecap="round"
                strokeWidth={2.5}
              />
            </Svg>
          </Pressable>
        </View>
      ))}

      {canAddMore && (
        <>
          <AddButton
            icon={
              <Svg fill="none" height={22} viewBox="0 0 24 24" width={22}>
                <Path
                  d="M23 19V8a2 2 0 0 0-2-2h-3.5l-1.5-2h-7l-1.5 2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h17a2 2 0 0 0 2-2z"
                  stroke="rgb(var(--color-text-subtle))"
                  strokeLinecap="round"
                  strokeWidth={1.6}
                />
                <Path
                  d="M16 13.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"
                  stroke="rgb(var(--color-text-subtle))"
                  strokeWidth={1.6}
                />
              </Svg>
            }
            label={i18n.t("tasting.action.takePhoto")}
            onPress={addFromCamera}
          />
          <AddButton
            icon={
              <Svg fill="none" height={22} viewBox="0 0 24 24" width={22}>
                <Path
                  d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"
                  stroke="rgb(var(--color-text-subtle))"
                  strokeWidth={1.6}
                />
                <Path
                  d="M9 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM21 15l-5-5L5 21"
                  stroke="rgb(var(--color-text-subtle))"
                  strokeLinecap="round"
                  strokeWidth={1.6}
                />
              </Svg>
            }
            label={i18n.t("tasting.action.pickPhoto")}
            onPress={addFromGallery}
          />
        </>
      )}
    </ScrollView>
  );
}

type AddButtonProps = {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
};

function AddButton({ label, icon, onPress }: AddButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className="h-20 w-20 items-center justify-center gap-1 rounded-md border border-border-strong border-dashed bg-surface-sunken"
      onPress={onPress}
    >
      {icon}
      <Text className="font-medium font-text text-overline text-text-subtle">
        {label}
      </Text>
    </Pressable>
  );
}
