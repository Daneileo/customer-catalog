import { CatalogChrome } from "@/components/catalog-chrome";

export default function MishkaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CatalogChrome store="mishka">{children}</CatalogChrome>;
}
