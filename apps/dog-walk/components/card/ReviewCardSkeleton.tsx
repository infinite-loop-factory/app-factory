import { View } from "react-native";
import { HStack } from "../ui/hstack";
import { Skeleton } from "../ui/skeleton";
import { VStack } from "../ui/vstack";

export default function ReviewCardSkeleton() {
  return (
    <View className="mb-4 flex w-full flex-row rounded-lg border border-slate-200 p-4">
      <Skeleton className="mr-4 h-10 w-10" variant="circular" />
      <VStack className="flex-1 gap-2">
        <HStack className="justify-between">
          <Skeleton className="h-4 w-20" variant="rounded" />
          <Skeleton className="h-4 w-32" variant="rounded" />
        </HStack>
        <Skeleton className="h-4 w-full" variant="rounded" />
        <Skeleton className="h-4 w-3/4" variant="rounded" />
      </VStack>
    </View>
  );
}
