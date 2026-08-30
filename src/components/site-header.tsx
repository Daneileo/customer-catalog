import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CategoryMenu } from "@/components/category-menu";
import { SearchForm } from "@/components/search-form";
import { SITE_NAME, WHATSAPP_DISPLAY, whatsappLink } from "@/lib/shops";

type Category = { id: string; name: string };

export function SiteHeader({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <CategoryMenu categories={categories} />
          <Link href="/" className="min-w-0 flex-1">
            <p className="font-heading text-lg font-semibold tracking-tight">
              {SITE_NAME}
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

        <SearchForm />
      </div>
    </header>
  );
}
