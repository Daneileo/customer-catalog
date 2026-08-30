import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isMasterEnabled } from "@/lib/master-access";

export function middleware(request: NextRequest) {
  if (isMasterEnabled()) {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL("/missing", request.url));
}

export const config = {
  matcher: ["/master", "/master/:path*"],
};
