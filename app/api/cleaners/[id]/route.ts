import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(["ADMIN"]);
    const body = await req.json() as { approved?: boolean; active?: boolean };
    const updated = await prisma.cleanerProfile.update({
      where: { id: params.id },
      data: {
        ...(body.approved !== undefined && { approved: body.approved }),
        ...(body.active !== undefined && { active: body.active }),
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update cleaner error:", error);
    return NextResponse.json({ error: "Unauthorized or failed" }, { status: 403 });
  }
}
