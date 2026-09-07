import Link from "next/link";
import type { CatalogItem } from "@/lib/catalog";
import { catalogItemPath, STORES, storeForShop, type CatalogMode } from "@/lib/shops";
import { formatYen } from "@/lib/titles";

export function ProductCard({
  item,
  mode = "storefront",
  showCatalog = false,
}: {
  item: CatalogItem;
  mode?: CatalogMode;
  showCatalog?: boolean;
}) {
  const price = formatYen(item.price);
  const original = formatYen(item.originalPrice);
  const itemHref = catalogItemPath(item.shop, item.id, mode);

  return (
    <article className="overflow-hidden rounded-xl border bg-card shadow-xs">
      <Link
        href={itemHref}
        className="group block transition-colors hover:border-foreground/20"
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
          {mode === "master" && (price || original) ? (
            <p className="text-sm font-medium">
              {price ? <span>{price}</span> : null}
              {original && original !== price ? (
                <span className="ml-2 text-muted-foreground line-through">
                  {original}
                </span>
              ) : null}
            </p>
          ) : null}
          {showCatalog ? (
            <p className="text-[11px] font-medium text-muted-foreground">
              {STORES[storeForShop(item.shop)]?.name ?? item.shop}
            </p>
          ) : null}
          <h2 className="line-clamp-2 text-sm leading-snug text-foreground/90">
            {item.title}
          </h2>
        </div>
      </Link>
      {mode === "master" && item.sourceUrl ? (
        <div className="border-t px-3 py-2">
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-foreground underline-offset-2 hover:underline"
          >
            Open album
          </a>
        </div>
      ) : null}
    </article>
  );
}

export function ProductGrid({
  items,
  mode = "storefront",
  showCatalog = false,
  emptyTitle = "No items on this page.",
  emptyDescription = "Try another page, category, or search.",
}: {
  items: CatalogItem[];
  mode?: CatalogMode;
  showCatalog?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-card px-6 py-16 text-center">
        <p className="font-medium">{emptyTitle}</p>
        <p className="mt-1 text-sm text-muted-foreground">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => (
        <ProductCard
          key={`${item.shop}-${item.id}`}
          item={item}
          mode={mode}
          showCatalog={showCatalog}
        />
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
