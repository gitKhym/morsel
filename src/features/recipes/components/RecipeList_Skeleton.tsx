import { Skeleton } from "~/components/ui/skeleton";

export default function RecipeListSkeleton() {
  return (
    <div className="grid w-full grid-cols-2 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-52 w-full" />
      ))}
    </div>
  );
}
