import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const profile = await prisma.cleanerProfile.findFirst({
    where: { email: email.toLowerCase().trim() },
  });

  if (!profile) {
    return NextResponse.json({ error: "No account found with that email." }, { status: 404 });
  }

  cookies().set("cleaner-id", profile.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return NextResponse.json({ ok: true });
}
