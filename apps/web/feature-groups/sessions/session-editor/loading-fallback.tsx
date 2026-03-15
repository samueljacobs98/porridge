import { Skeleton } from "@frontend/ui/components/skeleton";

export function LoadingFallback() {
  return (
    <div className="flex flex-col gap-0.5">
      <Skeleton className="w-fit">
        <h1 className="text-2xl font-semibold opacity-0">Loading...</h1>
      </Skeleton>
      <Skeleton className="h-[calc(100%-2px)] w-fit">
        <p className="text-sm opacity-0">14 Mar 2026</p>
      </Skeleton>
    </div>
  );
}
