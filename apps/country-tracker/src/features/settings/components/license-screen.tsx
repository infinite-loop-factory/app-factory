import licensesData from "@/assets/licenses.json";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { useThemeColor } from "@/hooks/use-theme-color";
import i18n from "@/libs/i18n";
import { ExternalLink } from "lucide-react-native";
import { Linking, TouchableOpacity } from "react-native";

interface LicenseItem {
  name: string;
  version?: string;
  license?: string;
  author?: string;
  description?: string;
  repository?: string;
  homepage?: string;
}

export default function LicenseScreen() {
  const [
    background,
    borderColor,
    headingColor,
    textColor,
    secondaryTextColor,
    linkColor,
  ] = useThemeColor([
    "background",
    "outline-200",
    "typography-900",
    "typography",
    "typography-600",
    "primary-600",
  ]);

  const licenses: LicenseItem[] = licensesData.licenses;

  const openPackagePage = (item: LicenseItem) => {
    // Try homepage first, then repository, then npm
    const url =
      item.homepage ||
      item.repository?.replace(/^git\+/, "").replace(/\.git$/, "") ||
      `https://www.npmjs.com/package/${item.name}`;
    Linking.openURL(url);
  };

  const renderLicenseItem = (item: LicenseItem, index: number) => {
    const isLast = index === licenses.length - 1;

    return (
      <TouchableOpacity
        key={item.name}
        className={`p-4 ${!isLast ? "border-b" : ""}`}
        style={{ borderBottomColor: borderColor }}
        onPress={() => openPackagePage(item)}
      >
        <Box className="flex-row items-start justify-between">
          <Box className="mr-3 flex-1">
            <Box className="mb-1 flex-row items-center">
              <Text
                className="font-bold text-base"
                style={{ color: textColor }}
              >
                {item.name}
              </Text>
              {item.version && (
                <Text
                  className="ml-2 text-sm"
                  style={{ color: secondaryTextColor }}
                >
                  v{item.version}
                </Text>
              )}
            </Box>

            {item.license && (
              <Badge
                className="mb-1 self-start"
                style={{ alignSelf: "flex-start" }}
              >
                <BadgeText className="font-bold text-xs">
                  {item.license}
                </BadgeText>
              </Badge>
            )}

            {item.author && (
              <Text
                className="mb-1 text-sm"
                style={{ color: secondaryTextColor }}
              >
                by {item.author}
              </Text>
            )}

            {item.description && (
              <Text
                className="text-sm leading-5"
                style={{ color: secondaryTextColor }}
              >
                {item.description}
              </Text>
            )}
          </Box>

          <ExternalLink size={16} color={linkColor} />
        </Box>
      </TouchableOpacity>
    );
  };

  return (
    <ParallaxScrollView>
      <Box className="mb-4 px-1 pt-2">
        <Text
          className="text-base leading-6"
          style={{ color: secondaryTextColor }}
        >
          {i18n.t("settings.license.description")}
        </Text>
      </Box>

      <Box
        className="mx-1 mb-4 rounded-lg border shadow-xs"
        style={{ backgroundColor: background, borderColor }}
      >
        <Box
          className="border-b p-4"
          style={{ borderBottomColor: borderColor }}
        >
          <Heading
            className="font-bold text-xl"
            style={{ color: headingColor }}
          >
            {i18n.t("settings.license.libraries")}
          </Heading>
          <Text className="mt-1 text-sm" style={{ color: secondaryTextColor }}>
            {i18n.t("settings.license.tap-to-view")} •{" "}
            {licensesData.totalPackages} packages
          </Text>
          <Text className="mt-1 text-xs" style={{ color: secondaryTextColor }}>
            Generated: {new Date(licensesData.generated).toLocaleDateString()}
          </Text>
        </Box>

        {licenses.map((item, index) => renderLicenseItem(item, index))}
      </Box>
    </ParallaxScrollView>
  );
}
