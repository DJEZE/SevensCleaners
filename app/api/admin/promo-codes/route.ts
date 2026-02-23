import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { z } from "zod";

export const dynamic = "force-dynamic";

function isAdmin() {
  const session = cookies().get("admin-session")?.value;
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin";
  return session === adminPassword;
}

const createSchema = z.object({
  code: z.string().min(2).max(30).regex(/^[A-Z0-9_-]+$/, "Code must be uppercase letters, numbers, hyphens, or underscores"),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().positive(),
  maxUses: z.number().int().positive().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
});

export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const codes = await prisma.promoCode.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(codes);
}

export async function POST(req: NextRequest) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = createSchema.parse({
      ...body,
      code: body.code?.toUpperCase().trim(),
    });

    if (data.discountType === "PERCENTAGE" && data.discountValue > 100) {
      return NextResponse.json({ error: "Percentage discount cannot exceed 100." }, { status: 400 });
    }

    const promo = await prisma.promoCode.create({
      data: {
        code: data.code,
        discountType: data.discountType,
        discountValue: data.discountValue,
        maxUses: data.maxUses ?? null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        active: true,
      },
    });

    return NextResponse.json(promo, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 });
    }
    if ((error as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "A promo code with that name already exists." }, { status: 409 });
    }
    console.error("Create promo code error:", error);
    return NextResponse.json({ error: "Failed to create promo code." }, { status: 500 });
  }
}
