import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { cleanerProfile: true },
    });
    if (!user?.cleanerProfile) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { availability } = await req.json() as { availability: string[] };

    const updated = await prisma.cleanerProfile.update({
      where: { id: user.cleanerProfile.id },
      data: { availability },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
