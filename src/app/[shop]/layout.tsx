import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { getAlbumIndex } from "@/lib/catalog";
import { WHATSAPP_DISPLAY, whatsappLink, getShop, type ShopSlug } from "@/lib/shops";

export default async function ShopLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ shop: string }>;
}) {
  const { shop: slug } = await params;
  const shop = getShop(slug);
  if (!shop) notFound();

  return (
    <>
      <Suspense fallback={<SiteHeader shop={shop.slug} categories={[]} />}>
        <ShopHeader shop={shop.slug} />
      </Suspense>
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6">
        {children}
      </main>
      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Photos for display. Message on WhatsApp to order.</p>
          <a
            className="font-medium text-foreground hover:underline"
            href={whatsappLink("Hi, I want to place an order.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp {WHATSAPP_DISPLAY}
          </a>
        </div>
      </footer>
    </>
  );
}

async function ShopHeader({ shop }: { shop: ShopSlug }) {
  let categories: { id: string; name: string }[] = [];
  try {
    const listing = await getAlbumIndex(shop, 1);
    categories = listing.categories;
  } catch {
    categories = [];
  }
  return <SiteHeader shop={shop} categories={categories} />;
}
