import { PaginationBar } from "@/components/pagination-bar";
import { ProductGrid } from "@/components/product-grid";
import type { CatalogPage } from "@/lib/catalog";
import type { CatalogMode, StoreSlug } from "@/lib/shops";

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function listingCsv(items: CatalogPage["items"]) {
  const header = "title,price,original_price,photos,shop,album_url";
  const rows = items.map((item) =>
    [
      csvEscape(item.title),
      item.price ?? "",
      item.originalPrice ?? "",
      item.photoCount,
      item.shop,
      item.sourceUrl ?? "",
    ].join(","),
  );
  return [header, ...rows].join("\n");
}

export function CatalogListing({
  title,
  description,
  data,
  pathname,
  query,
  mode = "storefront",
  showCatalog = false,
}: {
  store?: StoreSlug;
  title: string;
  description: string;
  data: CatalogPage;
  pathname: string;
  query?: Record<string, string | undefined>;
  activeCategoryId?: string;
  mode?: CatalogMode;
  showCatalog?: boolean;
}) {
  const csv = mode === "master" ? listingCsv(data.items) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {csv ? (
          <a
            className="text-sm font-medium underline-offset-2 hover:underline"
            href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
            download="master-catalog.csv"
          >
            Download this page (CSV)
          </a>
        ) : null}
      </div>
      <ProductGrid
        items={data.items}
        mode={mode}
        showCatalog={showCatalog}
        emptyTitle={
          query?.q ? `No titles match “${query.q}”` : undefined
        }
        emptyDescription={
          query?.q
            ? "Try a SKU, a brand, or any word that appears in the item title."
            : undefined
        }
      />
      <PaginationBar
        pathname={pathname}
        page={data.page}
        pageCount={data.pageCount}
        query={query}
      />
    </div>
  );
}
