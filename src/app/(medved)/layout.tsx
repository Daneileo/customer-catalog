import { CatalogChrome } from "@/components/catalog-chrome";

export default function MedvedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CatalogChrome store="medved">{children}</CatalogChrome>;
}
