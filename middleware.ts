import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

const clerk = clerkMiddleware();

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  try {
    return await clerk(req, event);
  } catch (error) {
    // If Clerk middleware fails (e.g. JWKS network error on edge), let the
    // request through. Individual API routes still enforce auth via auth().
    console.error("Clerk middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
