import { notFound } from "next/navigation";
import { CatalogChrome } from "@/components/catalog-chrome";
import { isMasterEnabled } from "@/lib/master-access";

export default function MasterMedvedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isMasterEnabled()) notFound();

  return (
    <CatalogChrome store="medved" mode="master">
      {children}
    </CatalogChrome>
  );
}
