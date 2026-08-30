import Link from "next/link";
import type { CatalogItem } from "@/lib/catalog";
import { formatYuan } from "@/lib/titles";

export function ProductCard({ item }: { item: CatalogItem }) {
  return (
    <Link
      href={`/${item.shop}/item/${item.id}`}
      className="group overflow-hidden rounded-xl border bg-card shadow-xs transition-colors hover:border-foreground/20"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.coverSrc}
          alt={item.title}
          loading="lazy"
          className="size-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        {item.photoCount > 0 ? (
          <span className="absolute top-2 right-2 rounded-full bg-black/70 px-2 py-0.5 text-[11px] text-white">
            {item.photoCount} photos
          </span>
        ) : null}
      </div>
      <div className="space-y-1.5 p-3">
        {item.price ? (
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold">{formatYuan(item.price)}</span>
            {item.originalPrice && item.originalPrice > item.price ? (
              <span className="text-xs text-muted-foreground line-through">
                {formatYuan(item.originalPrice)}
              </span>
            ) : null}
          </div>
        ) : null}
        <h2 className="line-clamp-2 text-sm leading-snug text-foreground/90">
          {item.title}
        </h2>
      </div>
    </Link>
  );
}

export function ProductGrid({ items }: { items: CatalogItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-card px-6 py-16 text-center">
        <p className="font-medium">No items on this page.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try another page, category, or search.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => (
        <ProductCard key={`${item.shop}-${item.id}`} item={item} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border bg-card">
          <div className="aspect-square animate-pulse bg-muted" />
          <div className="space-y-2 p-3">
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
