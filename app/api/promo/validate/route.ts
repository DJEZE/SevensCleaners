import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  code: z.string().min(1),
  subtotal: z.number().positive(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, subtotal } = schema.parse(body);

    const promo = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!promo) {
      return NextResponse.json({ valid: false, message: "Invalid promo code." }, { status: 200 });
    }

    if (!promo.active) {
      return NextResponse.json({ valid: false, message: "This promo code is no longer active." }, { status: 200 });
    }

    if (promo.expiresAt && new Date() > promo.expiresAt) {
      return NextResponse.json({ valid: false, message: "This promo code has expired." }, { status: 200 });
    }

    if (promo.maxUses !== null && promo.usedCount >= promo.maxUses) {
      return NextResponse.json({ valid: false, message: "This promo code has reached its usage limit." }, { status: 200 });
    }

    let discountAmount: number;
    if (promo.discountType === "PERCENTAGE") {
      discountAmount = Math.round((subtotal * promo.discountValue) / 100 * 100) / 100;
    } else {
      discountAmount = Math.min(promo.discountValue, subtotal);
    }

    return NextResponse.json({
      valid: true,
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      discountAmount,
      finalPrice: Math.max(0, subtotal - discountAmount),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 });
    }
    console.error("Promo validate error:", error);
    return NextResponse.json({ error: "Failed to validate promo code." }, { status: 500 });
  }
}
