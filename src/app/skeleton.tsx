import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SkeletonComponent() {
  const sk = [1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <div className="flex flex-row flex-wrap gap-4">
      {sk.map((item) => (
        <Card key={item} className="w-[320px]">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-[16px] w-full" />
            </CardTitle>
            <div className="truncate">
              <Skeleton className="h-[20px] w-full" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-24 rounded-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-[36px] w-[110px]" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
