import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cleanerId = cookies().get("cleaner-id")?.value;
    if (!cleanerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await prisma.cleanerProfile.findUnique({ where: { id: cleanerId } });
    if (!profile) return NextResponse.json({ error: "No profile" }, { status: 404 });

    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
