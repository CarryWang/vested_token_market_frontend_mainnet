import { SkeletonComponent } from "@/app/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <div>
      <div className="text-lg mb-6">
        <Skeleton className="h-[28px] w-[120px]" />
      </div>
      <SkeletonComponent />
    </div>
  );
}
