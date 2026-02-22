import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  try {
    const cleanerId = cookies().get("cleaner-id")?.value;
    if (!cleanerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { availability } = await req.json() as { availability: string[] };

    const updated = await prisma.cleanerProfile.update({
      where: { id: cleanerId },
      data: { availability },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
