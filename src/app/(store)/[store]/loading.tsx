import { ProductGridSkeleton } from "@/components/product-grid";

export default function StoreLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full max-w-md animate-pulse rounded bg-muted" />
      </div>
      <ProductGridSkeleton />
    </div>
  );
}
