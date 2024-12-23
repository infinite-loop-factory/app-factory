import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Box } from "@/components/ui/box";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Search } from "lucide-react-native";
import type { ListRenderItem } from "react-native";
import { FlatList } from "react-native";

type CountryItem = {
  id: string;
  country: string;
  flag: string;
  lastVisitDate: string;
};

const data: CountryItem[] = [
  { id: "1", country: "France", flag: "🇫🇷", lastVisitDate: "2023-01-15" },
  { id: "2", country: "Japan", flag: "🇯🇵", lastVisitDate: "2022-12-05" },
];

export default function HomeScreen() {
  const renderItem: ListRenderItem<CountryItem> = ({ item }) => (
    <VStack>
      <Box className="mt-4 flex flex-row justify-between p-2">
        <Box className="flex flex-1 flex-row gap-2">
          <Text>{item.flag}</Text>
          <Text>{item.country}</Text>
        </Box>
        <Text className="font-mono text-gray-500">{item.lastVisitDate}</Text>
      </Box>
      <Divider className="my-0.5" />
    </VStack>
  );

  return (
    <ParallaxScrollView scrollEnabled={false}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <VStack space="md">
            <Heading className="text-2xl text-typography-900">
              Visited Countries
            </Heading>
            <Input className="p-2" variant="outline">
              <InputField placeholder="Search..." />
              <InputSlot>
                <InputIcon as={Search} />
              </InputSlot>
            </Input>
          </VStack>
        }
        stickyHeaderIndices={[0]}
      />
    </ParallaxScrollView>
  );
}
