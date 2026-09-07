import { SiteFooter, SiteHeader } from "@/components/site-header";
import type { CatalogMode } from "@/lib/shops";

export function IntroShell({
  children,
  mode = "storefront",
}: {
  children: React.ReactNode;
  mode?: CatalogMode;
}) {
  return (
    <>
      <SiteHeader categories={[]} mode={mode} />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6">
        {children}
      </main>
      <SiteFooter mode={mode} />
    </>
  );
}
