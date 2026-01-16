import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("shimmer rounded-md bg-muted", className)} {...props} />;
}

// Recipe Card Skeleton
function RecipeCardSkeleton() {
  return (
    <div className="bg-card rounded-lg shadow-card overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton className="w-full h-48 rounded-none" />
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-7 w-20 rounded-pill" />
          <Skeleton className="h-7 w-24 rounded-pill" />
          <Skeleton className="h-7 w-28 rounded-pill" />
        </div>
      </div>
    </div>
  );
}

// List Item Skeleton
function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 bg-card rounded-lg shadow-card">
      <Skeleton className="w-16 h-16 rounded-image flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  );
}

// Stat Card Skeleton
function StatCardSkeleton() {
  return (
    <div className="bg-card rounded-lg shadow-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="w-5 h-5 rounded" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-7 w-16" />
      <Skeleton className="h-4 w-12" />
    </div>
  );
}

// Ingredient Card Skeleton
function IngredientCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 bg-card rounded-lg shadow-card">
      <Skeleton className="w-12 h-12 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="w-6 h-6 rounded" />
    </div>
  );
}

export { 
  Skeleton, 
  RecipeCardSkeleton, 
  ListItemSkeleton, 
  StatCardSkeleton, 
  IngredientCardSkeleton 
};
