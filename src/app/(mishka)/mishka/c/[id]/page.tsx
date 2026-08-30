import { CatalogError } from "@/components/catalog-error";
import { CatalogListing } from "@/components/catalog-listing";
import {
  CatalogError as FeedError,
  getStoreCategory,
  type CatalogPage,
} from "@/lib/catalog";
import { storeCategoryPath, storeHome } from "@/lib/shops";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const data = await getStoreCategory("mishka", id, 1);
    const current = data.categories.find((category) => category.id === id);
    return { title: current?.name || "Category" };
  } catch {
    return { title: "Category" };
  }
}

export default async function MishkaCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const page = Math.max(1, Number((await searchParams).page) || 1);

  let data: CatalogPage | null = null;
  let message: string | null = null;
  try {
    data = await getStoreCategory("mishka", id, page);
  } catch (error) {
    message =
      error instanceof FeedError
        ? error.message
        : "This category could not be loaded.";
  }

  if (!data) {
    return <CatalogError message={message ?? undefined} href={storeHome("mishka")} />;
  }

  const current = data.categories.find((category) => category.id === id);

  return (
    <CatalogListing
      store="mishka"
      title={current?.name || "Category"}
      description="Items from this brand. Click through for photos on this site only."
      data={data}
      pathname={storeCategoryPath("mishka", id)}
      activeCategoryId={id}
    />
  );
}
