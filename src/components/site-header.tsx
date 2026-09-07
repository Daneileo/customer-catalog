import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandNav } from "@/components/brand-nav";
import { CatalogTabs } from "@/components/catalog-tabs";
import { CategoryMenu } from "@/components/category-menu";
import { SearchForm } from "@/components/search-form";
import {
  STORE_LIST,
  WHATSAPP_DISPLAY,
  storeHome,
  whatsappLink,
  type CatalogMode,
  type StoreSlug,
} from "@/lib/shops";

type Category = { id: string; name: string };

export function SiteHeader({
  store,
  categories,
  mode = "storefront",
}: {
  store?: StoreSlug | null;
  categories: Category[];
  mode?: CatalogMode;
}) {
  const current = store ? STORE_LIST.find((entry) => entry.slug === store) : null;
  const master = mode === "master";
  const intro = !store;

  return (
    <header className="site-header">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          {store ? (
            <CategoryMenu store={store} categories={categories} mode={mode} />
          ) : (
            <div className="size-10 shrink-0" aria-hidden />
          )}
          <div className="min-w-0 flex-1">
            <p className="font-heading text-lg font-semibold tracking-tight">
              {intro ? "HOW TO ORDER" : current?.name}
              {master ? " · Master" : ""}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {intro
                ? "Start here, then pick a catalog below."
                : master
                  ? "Local only. Prices and album links — not on the published site."
                  : "Browse items. Photos only — no supplier links."}
            </p>
          </div>
          {master && store ? (
            <Button
              nativeButton={false}
              render={<Link href={storeHome(store)} />}
              size="sm"
              variant="outline"
              className="shrink-0"
            >
              Customer catalog
            </Button>
          ) : (
            <Button
              nativeButton={false}
              render={
                <a
                  href={whatsappLink("Hi, I want to place an order.")}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              size="sm"
              className="shrink-0"
            >
              WhatsApp {WHATSAPP_DISPLAY}
            </Button>
          )}
        </div>

        <CatalogTabs store={store} mode={mode} />

        <SearchForm store={store} mode={mode} />

        {store ? (
          <BrandNav store={store} categories={categories} mode={mode} />
        ) : null}
      </div>
    </header>
  );
}

export function SiteFooter({ mode = "storefront" }: { mode?: CatalogMode }) {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        {mode === "master" ? (
          <>
            <p>Local master copy with yuan prices and album links. Not published.</p>
            <Link className="font-medium text-foreground hover:underline" href="/">
              Back to customer catalog
            </Link>
          </>
        ) : (
          <>
            <p>Photos for display. Message on WhatsApp to order.</p>
            <a
              className="font-medium text-foreground hover:underline"
              href={whatsappLink("Hi, I want to place an order.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp {WHATSAPP_DISPLAY}
            </a>
          </>
        )}
      </div>
    </footer>
  );
}
