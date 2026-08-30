import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
  WHATSAPP_DISPLAY,
  getShop,
  storeForShop,
  storeHome,
  whatsappLink,
} from "@/lib/shops";
import { parseProductTitle } from "@/lib/titles";

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
    const item = await getItem(config.slug, id);
    return { title: item.title };
  } catch {
    return { title: "Item" };
  }
}

export default async function ItemPage({
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
    item = await getItem(shop.slug, id);
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
        href={storeHome(store)}
      />
    );
  }

  const parsed = parseProductTitle(item.title);
  const messageText = `Hi, I want to order: ${item.title}`;

  return (
    <div className="space-y-6">
      <Link
        href={storeHome(store)}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to {storeName}
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
        <PhotoGallery title={item.title} photos={item.photos} />

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-3">
            <h1 className="font-heading text-xl font-semibold leading-snug">
              {item.title}
            </h1>
            {parsed.note ? (
              <p className="text-sm text-muted-foreground">{parsed.note}</p>
            ) : null}
            {item.description ? (
              <p className="text-sm leading-relaxed">{item.description}</p>
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

          <Button
            nativeButton={false}
            size="lg"
            className="w-full"
            render={
              <a
                href={whatsappLink(messageText)}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            Order on WhatsApp · {WHATSAPP_DISPLAY}
          </Button>
          <p className="text-xs text-muted-foreground">
            This page only shows photos hosted here. There is no outbound
            product link on the item.
          </p>
        </aside>
      </div>
    </div>
  );
}
