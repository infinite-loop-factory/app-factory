import { Pressable, Text, View } from "react-native";

export type EmptyStateProps = {
  title: string;
  caption?: string;
  cta?: {
    label: string;
    onPress: () => void;
  };
};

export function EmptyState({ title, caption, cta }: EmptyStateProps) {
  return (
    <View className="items-center justify-center px-6 py-16">
      <Text className="font-display font-semibold text-h2 text-text">
        {title}
      </Text>
      {caption && (
        <Text className="mt-2 text-center font-text text-bodySm text-text-subtle">
          {caption}
        </Text>
      )}
      {cta && (
        <Pressable
          accessibilityRole="button"
          className="mt-6 h-11 items-center justify-center rounded-pill bg-brand px-5 active:opacity-80"
          onPress={cta.onPress}
        >
          <Text className="font-semibold font-text text-bodySm text-text-onBrand">
            {cta.label}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
