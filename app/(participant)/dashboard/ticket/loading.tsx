import { Skeleton } from "@/components/dashboard/skeleton";

export default function TicketLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="max-w-sm mx-auto rounded-3xl border-2 border-border bg-card overflow-hidden">
        <Skeleton className="h-32 w-full" />
        <div className="p-8 flex flex-col items-center gap-4">
          <Skeleton className="w-[200px] h-[200px] rounded-xl" />
          <Skeleton className="h-3 w-48" />
        </div>
        <div className="px-6 pb-6 flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </div>
  );
}
