import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const isLocalhost = host.startsWith("localhost") || host.startsWith("127.0.0.1");

  // Allow opt-in redirection from localhost to live production URL
  const shouldRedirectLocalhost =
    process.env.REDIRECT_LOCALHOST_TO_LIVE === "true" ||
    request.nextUrl.searchParams.get("redirect_live") === "true";

  if (shouldRedirectLocalhost && isLocalhost) {
    const liveUrl = new URL(
      request.nextUrl.pathname + request.nextUrl.search,
      process.env.NEXT_PUBLIC_SITE_URL || "https://kidsfoundation.globizsapp.com"
    );
    return NextResponse.redirect(liveUrl, 307);
  }

  // Quick live route shortcut
  if (request.nextUrl.pathname === "/live") {
    return NextResponse.redirect(
      process.env.NEXT_PUBLIC_SITE_URL || "https://kidsfoundation.globizsapp.com",
      307
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

