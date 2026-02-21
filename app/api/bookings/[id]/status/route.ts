import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { sendStatusUpdate } from "@/lib/notifications";
import { BookingStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(["ADMIN"]);

    const { status } = await req.json() as { status: BookingStatus };

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { customer: { include: { user: true } } },
    });
    if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updated = await prisma.booking.update({
      where: { id: params.id },
      data: { status },
    });

    // Send notification
    await sendStatusUpdate(
      booking,
      status,
      booking.customer.phone ?? undefined,
      booking.customer.user.email
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update booking status error:", error);
    return NextResponse.json({ error: "Unauthorized or failed" }, { status: 403 });
  }
}
