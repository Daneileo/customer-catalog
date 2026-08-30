import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CategoryMenu } from "@/components/category-menu";
import { SearchForm } from "@/components/search-form";
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
          <CategoryMenu shop={shop} categories={categories} />
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
            className="shrink-0"
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

        <SearchForm shop={shop} />
      </div>
    </header>
  );
}
