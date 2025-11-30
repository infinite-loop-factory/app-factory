import { HStack } from "../ui/hstack";
import { Skeleton } from "../ui/skeleton";
import { VStack } from "../ui/vstack";

export default function CourseCardSkeleton() {
  return (
    <VStack className="w-72 overflow-hidden rounded-lg border border-slate-200">
      <Skeleton className="h-40 w-72" variant="sharp" />
      <VStack className="gap-2 p-4">
        <Skeleton className="h-5 w-40" variant="rounded" />
        <HStack className="gap-2">
          <Skeleton className="h-4 w-24" variant="rounded" />
          <Skeleton className="h-4 w-24" variant="rounded" />
        </HStack>
        <HStack className="items-center gap-2">
          <Skeleton className="h-4 w-4" variant="circular" />
          <Skeleton className="h-4 w-32" variant="rounded" />
        </HStack>
      </VStack>
    </VStack>
  );
}
