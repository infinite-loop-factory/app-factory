import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, Platform } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { Text } from "@/components/ui/text";

export default function SettingsScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons
          size={310}
          name="code-slash"
          className="absolute bottom-[-90px] left-[-35px] text-gray-400"
        />
      }
    >
      <ThemedView className="flex-row gap-2">
        <Text bold size="4xl">
          Explore
        </Text>
      </ThemedView>
      <Text>This app includes example code to help you get started.</Text>
      <Collapsible title="File-based routing">
        <Text>
          This app has two screens: <Text bold>app/(tabs)/index.tsx</Text> and{" "}
          <Text bold>app/(tabs)/explore.tsx</Text>
        </Text>
        <Text>
          The layout file in <Text bold>app/(tabs)/_layout.tsx</Text> sets up
          the tab navigator.
        </Text>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <Text bold>Learn more</Text>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <Text>
          You can open this project on Android, iOS, and the web. To open the
          web version, press <Text bold>w</Text> in the terminal running this
          project.
        </Text>
      </Collapsible>
      <Collapsible title="Images">
        <Text>
          For static images, you can use the <Text bold>@2x</Text> and{" "}
          <Text bold>@3x</Text> suffixes to provide files for different screen
          densities
        </Text>
        <Image
          source={require("@/assets/images/react-logo.png")}
          className="self-center"
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <Text underline>Learn more</Text>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Custom fonts">
        <Text>
          Open <Text bold>app/_layout.tsx</Text> to see how to load{" "}
          <Text className="font-mono">custom fonts such as this one.</Text>
        </Text>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
          <Text underline>Learn more</Text>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <Text>
          This template has light and dark mode support. The{" "}
          <Text bold>useColorScheme()</Text> hook lets you inspect what the
          user's current color scheme is, and so you can adjust UI colors
          accordingly.
        </Text>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <Text underline>Learn more</Text>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <Text>
          This template includes an example of an animated component. The{" "}
          <Text bold>components/HelloWave.tsx</Text> component uses the powerful{" "}
          <Text bold>react-native-reanimated</Text> library to create a waving
          hand animation. library to create a waving hand animation.
        </Text>
        {Platform.select({
          ios: (
            <Text>
              The <Text bold>components/ParallaxScrollView.tsx</Text> component
              provides a parallax effect for the header image.
            </Text>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}
