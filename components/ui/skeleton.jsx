import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-slate-200/80", className)}
      {...props}
    />
  );
}

export function OpportunityCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-md" />
        <Skeleton className="h-6 w-20 rounded-md" />
      </div>
      <Skeleton className="h-16 w-full rounded-xl" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-24 rounded-xl" />
      </div>
    </div>
  );
}
