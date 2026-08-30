import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { getCombinedIndex } from "@/lib/catalog";
import { WHATSAPP_DISPLAY, whatsappLink } from "@/lib/shops";

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<SiteHeader categories={[]} />}>
        <CatalogHeader />
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

async function CatalogHeader() {
  let categories: { id: string; name: string }[] = [];
  try {
    const listing = await getCombinedIndex(1);
    categories = listing.categories;
  } catch {
    categories = [];
  }
  return <SiteHeader categories={categories} />;
}
