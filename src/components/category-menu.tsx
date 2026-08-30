"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

type Category = { id: string; name: string };

export function CategoryMenu({
  categories,
}: {
  categories: Category[];
}) {
  const pathname = usePathname();

  return (
    <div className="relative" key={pathname}>
      <input id="category-menu" type="checkbox" className="peer sr-only" />
      <label
        htmlFor="category-menu"
        className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-background hover:bg-muted"
        aria-label="Categories"
      >
        <Menu className="size-4" />
      </label>
      <div className="pointer-events-none invisible fixed inset-0 z-50 peer-checked:pointer-events-auto peer-checked:visible">
        <label
          htmlFor="category-menu"
          className="absolute inset-0 bg-black/40"
          aria-label="Close categories"
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
                Categories
              </h2>
              <p className="text-sm text-muted-foreground">
                Filter this catalog. Item pages stay on this site.
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
          <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
            <Link
              href="/"
              className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              All items
            </Link>
            {categories.length === 0 ? (
              <p className="px-3 py-6 text-sm text-muted-foreground">
                Categories will appear when the catalog loads.
              </p>
            ) : (
              categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/c/${category.id}`}
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-muted"
                >
                  {category.name}
                </Link>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
