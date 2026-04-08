import { TableSkeleton, Skeleton } from "@/components/ui/Loader";

export default function PatientsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
      <Skeleton className="h-10 w-80 rounded-xl" />
      <TableSkeleton rows={6} cols={4} />
    </div>
  );
}
