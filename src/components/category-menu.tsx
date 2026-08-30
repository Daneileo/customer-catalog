"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { brandLetter } from "@/lib/category-nav";
import {
  catalogCategoryPath,
  catalogHome,
  type CatalogMode,
  type StoreSlug,
} from "@/lib/shops";

type Category = { id: string; name: string };

export function CategoryMenu({
  store,
  categories,
  mode = "storefront",
}: {
  store: StoreSlug;
  categories: Category[];
  mode?: CatalogMode;
}) {
  const pathname = usePathname();
  const letters = [...new Set(categories.map((category) => brandLetter(category.name)))].sort(
    (a, b) => (a === "#" ? -1 : b === "#" ? 1 : a.localeCompare(b)),
  );

  return (
    <div className="relative" key={pathname}>
      <input id="category-menu" type="checkbox" className="peer sr-only" />
      <label
        htmlFor="category-menu"
        className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-background hover:bg-muted"
        aria-label="Brands"
      >
        <Menu className="size-4" />
      </label>
      <div className="pointer-events-none invisible fixed inset-0 z-50 peer-checked:pointer-events-auto peer-checked:visible">
        <label
          htmlFor="category-menu"
          className="absolute inset-0 bg-black/40"
          aria-label="Close brands"
        />
        <aside
          className="absolute inset-y-0 left-0 flex w-[min(100%,24rem)] flex-col bg-background shadow-lg"
          aria-labelledby="category-drawer-title"
        >
          <div className="flex items-start justify-between gap-3 border-b p-4">
            <div>
              <h2
                id="category-drawer-title"
                className="font-heading text-base font-medium"
              >
                Brands
              </h2>
              <p className="text-sm text-muted-foreground">
                Open a brand to see its items. Photos stay on this site.
              </p>
            </div>
            <label
              htmlFor="category-menu"
              className="inline-flex size-7 cursor-pointer items-center justify-center rounded-lg hover:bg-muted"
              aria-label="Close"
            >
              <X className="size-4" />
            </label>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-3">
            <Link
              href={catalogHome(store, mode)}
              className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              All items
            </Link>
            {categories.length === 0 ? (
              <p className="px-3 py-6 text-sm text-muted-foreground">
                Brands will appear when the catalog loads.
              </p>
            ) : (
              letters.map((letter) => (
                <div key={letter} className="mt-2">
                  <p className="px-3 py-1 text-xs font-medium text-muted-foreground">
                    {letter}
                  </p>
                  {categories
                    .filter((category) => brandLetter(category.name) === letter)
                    .map((category) => (
                      <Link
                        key={category.id}
                        href={catalogCategoryPath(store, category.id, mode)}
                        className="block rounded-lg px-3 py-2 text-sm hover:bg-muted"
                      >
                        {category.name}
                      </Link>
                    ))}
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
