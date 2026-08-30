import { notFound } from "next/navigation";
import { CategoryChips } from "@/components/category-chips";
import { CatalogError } from "@/components/catalog-error";
import { PaginationBar } from "@/components/pagination-bar";
import { ProductGrid } from "@/components/product-grid";
import {
  CatalogError as FeedError,
  getCategoryPage,
  type CatalogPage,
} from "@/lib/catalog";
import { getShop } from "@/lib/shops";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shop: string; id: string }>;
}) {
  const { shop } = await params;
  const config = getShop(shop);
  return { title: config ? `Category · ${config.name}` : "Category" };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ shop: string; id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { shop: slug, id } = await params;
  const shop = getShop(slug);
  if (!shop) notFound();

  const page = Math.max(1, Number((await searchParams).page) || 1);

  let data: CatalogPage | null = null;
  let message: string | null = null;
  try {
    data = await getCategoryPage(shop.slug, id, page);
  } catch (error) {
    message =
      error instanceof FeedError
        ? error.message
        : "This category could not be loaded.";
  }

  if (!data) {
    return <CatalogError message={message ?? undefined} href={`/${shop.slug}`} />;
  }

  const current = data.categories.find((c) => c.id === id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {current?.name || "Category"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Items in this category. Click through for photos on this site only.
        </p>
      </div>
      <CategoryChips
        shop={shop.slug}
        categories={data.categories}
        activeId={id}
      />
      <ProductGrid items={data.items} />
      <PaginationBar
        pathname={`/${shop.slug}/c/${id}`}
        page={data.page}
        pageCount={data.pageCount}
      />
    </div>
  );
}
