import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // /api/bootstrap manages its own Cache-Control to support ETag/304.
  if (!request.nextUrl.pathname.startsWith("/api/bootstrap")) {
    response.headers.set("Cache-Control", "private, no-store");
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
