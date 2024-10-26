import { Image, Platform } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { Text } from "@/components/ui/text";
import i18n from "@/i18n";
import { cn } from "@infinite-loop-factory/common";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          className="absolute bottom-0 left-0 h-[178px] w-[290px]"
        />
      }
    >
      <ThemedView className="flex-row items-center gap-2">
        <Text bold size="4xl">
          {i18n.t("welcome")}!
        </Text>
        <HelloWave />
      </ThemedView>
      <ThemedView className="mb-2 gap-2">
        <Text bold size="2xl" className={cn("text-red-500", "ml-10")}>
          Step 1: Try it
        </Text>
        <Text>
          Edit <Text bold>app/(tabs)/index.tsx</Text> to see changes. Press{" "}
          <Text bold>
            {Platform.select({ ios: "cmd + d", android: "cmd + m" })}
          </Text>{" "}
          to open developer tools.
        </Text>
      </ThemedView>
      <ThemedView className="mb-2 gap-2">
        <Text bold size="2xl">
          Step 2: Explore
        </Text>
        <Text>
          Tap the Explore tab to learn more about what's included in this
          starter app.
        </Text>
      </ThemedView>
      <ThemedView className="mb-2 gap-2">
        <Text bold size="2xl">
          Step 3: Get a fresh start
        </Text>
        <Text>
          When you're ready, run <Text bold>npm run reset-project</Text> to get
          a fresh <Text bold>app</Text> directory. This will move the current{" "}
          <Text bold>app</Text> to <Text bold>app-example</Text>.
        </Text>
      </ThemedView>
    </ParallaxScrollView>
  );
}
