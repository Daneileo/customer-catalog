import { CatalogChrome } from "@/components/catalog-chrome";

export default function MasterMedvedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CatalogChrome store="medved" mode="master">
      {children}
    </CatalogChrome>
  );
}
