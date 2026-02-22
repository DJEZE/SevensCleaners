import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin routes (except login page)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = req.cookies.get("admin-session")?.value;
    if (session !== ADMIN_PASSWORD) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Protect cleaner routes (except login and onboarding)
  if (
    pathname.startsWith("/cleaner") &&
    pathname !== "/cleaner/login" &&
    !pathname.startsWith("/cleaner/onboarding")
  ) {
    const cleanerId = req.cookies.get("cleaner-id")?.value;
    if (!cleanerId) {
      return NextResponse.redirect(new URL("/cleaner/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
