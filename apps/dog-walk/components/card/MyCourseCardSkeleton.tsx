import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Skeleton } from "../ui/skeleton";

export default function MyCourseCardSkeleton() {
  return (
    <HStack className="gap-3 rounded-xl bg-white p-3">
      {/* 이미지 스켈레톤 */}
      <Skeleton className="h-24 w-24 rounded-lg" variant="sharp" />

      {/* 콘텐츠 스켈레톤 */}
      <VStack className="flex-1 gap-1">
        {/* 제목 라인 */}
        <HStack className="items-center justify-between gap-2">
          <Skeleton className="h-5 w-32" variant="rounded" />
          <Skeleton className="h-4 w-4 rounded-full" variant="circular" />
        </HStack>

        {/* 도착지 라인 */}
        <HStack className="items-center gap-1">
          <Skeleton className="h-3 w-3 rounded-full" variant="circular" />
          <Skeleton className="h-4 w-24" variant="rounded" />
        </HStack>

        {/* 거리/시간 라인 */}
        <HStack className="items-center gap-1">
          <Skeleton className="h-4 w-16" variant="rounded" />
          <Skeleton className="h-4 w-16" variant="rounded" />
        </HStack>

        {/* 날짜 라인 */}
        <Skeleton className="h-4 w-32" variant="rounded" />
      </VStack>
    </HStack>
  );
}
