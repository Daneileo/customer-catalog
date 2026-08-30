import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CatalogError } from "@/components/catalog-error";
import { PhotoGallery } from "@/components/photo-gallery";
import {
  CatalogError as FeedError,
  getItem,
  type ItemDetail,
} from "@/lib/catalog";
import {
  STORES,
  catalogHome,
  catalogItemPath,
  getShop,
  storeForShop,
} from "@/lib/shops";
import { formatYen, parseProductTitle } from "@/lib/titles";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shop: string; id: string }>;
}) {
  const { shop, id } = await params;
  const config = getShop(shop);
  if (!config) return { title: "Item" };
  try {
    const item = await getItem(config.slug, id, { master: true });
    return { title: `${item.title} · master` };
  } catch {
    return { title: "Item" };
  }
}

export default async function MasterItemPage({
  params,
}: {
  params: Promise<{ shop: string; id: string }>;
}) {
  const { shop: slug, id } = await params;
  const shop = getShop(slug);
  if (!shop) notFound();

  const store = storeForShop(shop.slug);
  const storeName = STORES[store].name;

  let item: ItemDetail | null = null;
  let message: string | null = null;
  try {
    item = await getItem(shop.slug, id, { master: true });
  } catch (error) {
    message =
      error instanceof FeedError
        ? error.message
        : "This item could not be loaded.";
  }

  if (!item) {
    return (
      <CatalogError
        title="Item unavailable"
        message={message ?? undefined}
        href={catalogHome(store, "master")}
      />
    );
  }

  const parsed = parseProductTitle(item.title);
  const price = formatYen(item.price);
  const original = formatYen(item.originalPrice);
  const extraLinks = item.links.filter((url) => url !== item.sourceUrl);

  return (
    <div className="space-y-6">
      <Link
        href={catalogHome(store, "master")}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to {storeName} master
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
        <PhotoGallery title={item.title} photos={item.photos} />

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-3">
            {price || original ? (
              <p className="text-2xl font-semibold tracking-tight">
                {price}
                {original && original !== price ? (
                  <span className="ml-3 text-base font-normal text-muted-foreground line-through">
                    {original}
                  </span>
                ) : null}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">No yuan price in the title.</p>
            )}
            <h1 className="font-heading text-xl font-semibold leading-snug">
              {item.title}
            </h1>
            {parsed.note ? (
              <p className="text-sm text-muted-foreground">{parsed.note}</p>
            ) : null}
            {item.description ? (
              <p className="text-sm leading-relaxed break-all">{item.description}</p>
            ) : null}
          </div>

          <dl className="grid grid-cols-2 gap-3 text-sm">
            {parsed.sku ? (
              <div className="rounded-lg bg-muted px-3 py-2">
                <dt className="text-xs text-muted-foreground">SKU</dt>
                <dd className="font-medium">{parsed.sku}</dd>
              </div>
            ) : null}
            <div className="rounded-lg bg-muted px-3 py-2">
              <dt className="text-xs text-muted-foreground">Photos</dt>
              <dd className="font-medium">{item.photos.length}</dd>
            </div>
            <div className="rounded-lg bg-muted px-3 py-2">
              <dt className="text-xs text-muted-foreground">Catalog</dt>
              <dd className="font-medium">{storeName}</dd>
            </div>
          </dl>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Album link</p>
            <Button
              nativeButton={false}
              size="lg"
              className="w-full"
              render={
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              Open album
              <ExternalLink className="size-4" />
            </Button>
            {extraLinks.length > 0 ? (
              <ul className="space-y-1 break-all text-sm">
                {extraLinks.map((url) => (
                  <li key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline-offset-2 hover:underline"
                    >
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <p className="text-xs text-muted-foreground">
            Customer photo page:{" "}
            <Link
              href={catalogItemPath(item.shop, item.id)}
              className="font-medium text-foreground hover:underline"
            >
              {catalogItemPath(item.shop, item.id)}
            </Link>
          </p>
        </aside>
      </div>
    </div>
  );
}
