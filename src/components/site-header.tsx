"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SHOP_LIST, WHATSAPP_DISPLAY, whatsappLink, type ShopSlug } from "@/lib/shops";
import { cn } from "@/lib/utils";

type Category = { id: string; name: string };

export function SiteHeader({
  shop,
  categories,
}: {
  shop: ShopSlug;
  categories: Category[];
}) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <CategorySheet shop={shop} categories={categories} />
          <Link href={`/${shop}`} className="min-w-0 flex-1">
            <p className="font-heading text-lg font-semibold tracking-tight">
              Catalog
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Browse items. Photos only — no supplier links.
            </p>
          </Link>
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
            className="hidden sm:inline-flex"
          >
            WhatsApp {WHATSAPP_DISPLAY}
          </Button>
        </div>

        <nav className="flex gap-1 overflow-x-auto pb-1">
          {SHOP_LIST.map((item) => (
            <Link
              key={item.slug}
              href={`/${item.slug}`}
              className={cn(
                "rounded-full px-3 py-1 text-sm whitespace-nowrap transition-colors",
                item.slug === shop
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <Suspense fallback={<SearchForm shop={shop} />}>
          <SearchFormFromUrl shop={shop} />
        </Suspense>
      </div>
    </header>
  );
}

function SearchFormFromUrl({ shop }: { shop: ShopSlug }) {
  const params = useSearchParams();
  return <SearchForm shop={shop} defaultValue={params.get("q") ?? ""} />;
}

function SearchForm({
  shop,
  defaultValue = "",
}: {
  shop: ShopSlug;
  defaultValue?: string;
}) {
  return (
    <form action={`/${shop}/search`} className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        name="q"
        defaultValue={defaultValue}
        placeholder="Search hoodies, jackets, SKUs…"
        className="h-10 bg-card pl-8 text-sm"
      />
    </form>
  );
}

function CategorySheet({
  shop,
  categories,
}: {
  shop: ShopSlug;
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline", size: "icon" }), "size-10")}
        aria-expanded={open}
        aria-label="Categories"
        onClick={() => setOpen(true)}
      >
        <Menu />
      </button>
      {open
        ? createPortal(
            <div className="fixed inset-0 z-50">
              <button
                type="button"
                aria-label="Close categories"
                className="absolute inset-0 bg-black/40"
                onClick={() => setOpen(false)}
              />
              <aside
                role="dialog"
                aria-modal="true"
                aria-labelledby="category-drawer-title"
                className="absolute inset-y-0 left-0 flex w-[min(100%,24rem)] flex-col bg-background shadow-lg"
              >
                <div className="flex items-start justify-between gap-3 border-b p-4">
                  <div>
                    <h2
                      id="category-drawer-title"
                      className="font-heading text-base font-medium"
                    >
                      Categories
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Filter this catalog. Item pages stay on this site.
                    </p>
                  </div>
                  <button
                    type="button"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon-sm" }),
                    )}
                    aria-label="Close"
                    onClick={() => setOpen(false)}
                  >
                    <X />
                  </button>
                </div>
                <div className="p-4">
                  <Input
                    value={query}
                    onChange={(event) =>
                      setQuery((event.target as HTMLInputElement).value)
                    }
                    placeholder="Filter categories"
                  />
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-6">
                  <Link
                    href={`/${shop}`}
                    className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                    onClick={() => setOpen(false)}
                  >
                    All items
                  </Link>
                  {filtered.length === 0 ? (
                    <p className="px-3 py-6 text-sm text-muted-foreground">
                      No categories match that filter.
                    </p>
                  ) : (
                    filtered.map((category) => (
                      <Link
                        key={category.id}
                        href={`/${shop}/c/${category.id}`}
                        className="block rounded-lg px-3 py-2 text-sm hover:bg-muted"
                        onClick={() => setOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))
                  )}
                </div>
              </aside>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
