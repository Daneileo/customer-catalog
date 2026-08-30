import { NextRequest } from "next/server";
import { getShop } from "@/lib/shops";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ shop: string; path: string[] }> },
) {
  const { shop: shopSlug, path } = await context.params;
  const shop = getShop(shopSlug);
  if (!shop) {
    return new Response("Not found", { status: 404 });
  }

  const relative = path.join("/");
  if (
    !relative ||
    relative.includes("..") ||
    relative.includes(":") ||
    relative.startsWith("/")
  ) {
    return new Response("Bad request", { status: 400 });
  }

  const url = `https://photo.yupoo.com/${shop.photoUser}/${relative}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Referer: `https://${shop.host}/`,
      Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
    },
    signal: AbortSignal.timeout(20000),
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    return new Response("Image unavailable", { status: 502 });
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("text/html")) {
    return new Response("Image unavailable", { status: 502 });
  }

  const buffer = await res.arrayBuffer();
  return new Response(buffer, {
    headers: {
      "Content-Type": contentType || "image/jpeg",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, immutable",
    },
  });
}
