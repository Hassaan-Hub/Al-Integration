export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-md bg-slate-200/70 ${className}`} aria-hidden="true" />
);

export const TaskCardSkeleton = () => (
  <div className="rounded-xl border border-slate-200 bg-white p-5">
    <div className="flex items-start justify-between gap-4">
      <div className="w-full space-y-3">
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-3 w-4/5" />
      </div>
      <Skeleton className="h-6 w-24 rounded-full" />
    </div>
    <div className="mt-6 flex items-center gap-4">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-3 w-24" />
    </div>
  </div>
);
