import { CategoryChips } from "@/components/category-chips";
import { PaginationBar } from "@/components/pagination-bar";
import { ProductGrid } from "@/components/product-grid";
import type { CatalogPage } from "@/lib/catalog";
import type { StoreSlug } from "@/lib/shops";

export function CatalogListing({
  store,
  title,
  description,
  data,
  pathname,
  query,
  activeCategoryId,
}: {
  store: StoreSlug;
  title: string;
  description: string;
  data: CatalogPage;
  pathname: string;
  query?: Record<string, string | undefined>;
  activeCategoryId?: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <CategoryChips
        store={store}
        categories={data.categories}
        activeId={activeCategoryId}
      />
      <ProductGrid items={data.items} />
      <PaginationBar
        pathname={pathname}
        page={data.page}
        pageCount={data.pageCount}
        query={query}
      />
    </div>
  );
}
