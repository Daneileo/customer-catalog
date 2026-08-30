import { SiteFooter, SiteHeader } from "@/components/site-header";

export function IntroShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader categories={[]} />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
