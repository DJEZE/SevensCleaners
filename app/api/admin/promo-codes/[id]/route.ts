import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

function isAdmin() {
  const session = cookies().get("admin-session")?.value;
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin";
  return session === adminPassword;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { active } = body;

  if (typeof active !== "boolean") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const promo = await prisma.promoCode.update({
    where: { id: params.id },
    data: { active },
  });

  return NextResponse.json(promo);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.promoCode.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
