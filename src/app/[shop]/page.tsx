import { notFound } from "next/navigation";
import { CategoryChips } from "@/components/category-chips";
import { CatalogError } from "@/components/catalog-error";
import { PaginationBar } from "@/components/pagination-bar";
import { ProductGrid } from "@/components/product-grid";
import {
  CatalogError as FeedError,
  getAlbumIndex,
  type CatalogPage,
} from "@/lib/catalog";
import { getShop } from "@/lib/shops";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shop: string }>;
}) {
  const shop = getShop((await params).shop);
  if (!shop) return { title: "Catalog" };
  return { title: shop.name };
}

export default async function ShopHome({
  params,
  searchParams,
}: {
  params: Promise<{ shop: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { shop: slug } = await params;
  const shop = getShop(slug);
  if (!shop) notFound();

  const page = Math.max(1, Number((await searchParams).page) || 1);

  let data: CatalogPage | null = null;
  let message: string | null = null;
  try {
    data = await getAlbumIndex(shop.slug, page);
  } catch (error) {
    message =
      error instanceof FeedError
        ? error.message
        : "The product feed is temporarily unavailable.";
  }

  if (!data) {
    return <CatalogError message={message ?? undefined} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {shop.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          {shop.blurb}. Open any item for photos — nothing links away from this
          site.
        </p>
      </div>
      <CategoryChips shop={shop.slug} categories={data.categories} />
      <ProductGrid items={data.items} />
      <PaginationBar
        pathname={`/${shop.slug}`}
        page={data.page}
        pageCount={data.pageCount}
      />
    </div>
  );
}
