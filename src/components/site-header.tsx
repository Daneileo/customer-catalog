import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandNav } from "@/components/brand-nav";
import { CategoryMenu } from "@/components/category-menu";
import { SearchForm } from "@/components/search-form";
import {
  STORE_LIST,
  WHATSAPP_DISPLAY,
  catalogHome,
  storeHome,
  whatsappLink,
  type CatalogMode,
  type StoreSlug,
} from "@/lib/shops";
import { cn } from "@/lib/utils";

type Category = { id: string; name: string };

export function SiteHeader({
  store,
  categories,
  mode = "storefront",
}: {
  store: StoreSlug;
  categories: Category[];
  mode?: CatalogMode;
}) {
  const current = STORE_LIST.find((entry) => entry.slug === store) ?? STORE_LIST[0];
  const master = mode === "master";

  return (
    <header className="sticky top-0 z-40 overflow-visible border-b bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <CategoryMenu store={store} categories={categories} mode={mode} />
          <div className="min-w-0 flex-1">
            <p className="font-heading text-lg font-semibold tracking-tight">
              {current.name}
              {master ? " · Master" : ""}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {master
                ? "Prices and album links for ordering. Customer catalog stays link-free."
                : "Browse items. Photos only — no supplier links."}
            </p>
          </div>
          {master ? (
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

        <nav className="flex gap-1" aria-label="Catalogs">
          {STORE_LIST.map((entry) => {
            const active = entry.slug === store;
            return (
              <Link
                key={entry.slug}
                href={catalogHome(entry.slug, mode)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm",
                  active
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {entry.name}
              </Link>
            );
          })}
        </nav>

        <BrandNav store={store} categories={categories} mode={mode} />
        <SearchForm store={store} mode={mode} />
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
            <p>Master copy with yuan prices and album links. Not the customer storefront.</p>
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
